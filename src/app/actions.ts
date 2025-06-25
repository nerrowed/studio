'use server';

import { getFirestoreInstance } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, Timestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export interface UserQuote {
  id: string;
  quote: string;
  author: string;
  createdAt: string;
}

// Ganti dengan Secret Key Cloudflare Turnstile Anda
const TURNSTILE_SECRET_KEY = "0x4AAAAAABiWt6FUHfXOsvidZ2s7kn9RIOQ"; 

export async function addQuoteAction(data: { quote: string; author: string; token: string }) {
  try {
    const ip = headers().get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';

    // Verify Turnstile token
    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            secret: TURNSTILE_SECRET_KEY,
            response: data.token,
            remoteip: ip,
        }),
    });
    const outcome = await turnstileResponse.json();
    if (!outcome.success) {
        return { success: false, error: 'CAPTCHA verification failed. Please try again.' };
    }


    const db = getFirestoreInstance();

    // Rate limiting: 10 requests per IP per day
    const rateLimitRef = doc(db, "rateLimits", ip);
    const rateLimitSnap = await getDoc(rateLimitRef);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (rateLimitSnap.exists()) {
        const { count, lastRequest } = rateLimitSnap.data();
        const lastRequestDate = (lastRequest as Timestamp).toDate();
        lastRequestDate.setHours(0, 0, 0, 0);

        if (lastRequestDate.getTime() === today.getTime()) {
            if (count >= 10) {
                return { success: false, error: "You have reached your daily limit of 10 submissions." };
            }
            await setDoc(rateLimitRef, { count: count + 1, lastRequest: serverTimestamp() }, { merge: true });
        } else {
            await setDoc(rateLimitRef, { count: 1, lastRequest: serverTimestamp() });
        }
    } else {
        await setDoc(rateLimitRef, { count: 1, lastRequest: serverTimestamp() });
    }

    await addDoc(collection(db, 'quotes'), {
      quote: data.quote,
      author: data.author,
      createdAt: serverTimestamp(),
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error in addQuoteAction: ', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to save quote. Reason: ${errorMessage}` };
  }
}

export async function getQuotesAction(): Promise<UserQuote[]> {
    try {
        const db = getFirestoreInstance();
        const quotesCollection = collection(db, 'quotes');
        const q = query(quotesCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const quotes = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const createdAt = data.createdAt as Timestamp;
            return {
                id: doc.id,
                quote: data.quote,
                author: data.author,
                createdAt: createdAt ? createdAt.toDate().toISOString() : new Date().toISOString(),
            };
        });
        return quotes;
    } catch (error) {
        console.error("Error getting documents from database: ", error);
        return [];
    }
}
