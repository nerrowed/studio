'use server';

import { db } from '@/lib/firebase';
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
    await addDoc(collection(db, 'quotes'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error adding document: ', error);
    return { success: false, error: 'Failed to save message to database.' };
  }
}

export async function getQuotesAction(): Promise<UserQuote[]> {
    try {
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
