'use server';

import { getFirestoreInstance } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export interface UserQuote {
  id: string;
  quote: string;
  author: string;
  createdAt: string;
}

export async function addQuoteAction(data: { quote: string; author: string }) {
  try {
    const db = getFirestoreInstance();
    await addDoc(collection(db, 'quotes'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error adding document to Firestore: ', error);
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
