import { NextResponse } from 'next/server';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: Request) {
  const { password } = await request.json();

  const adminDoc = await getDoc(doc(db, 'settings', 'admin'));
  const correctPassword = adminDoc.exists() ? adminDoc.data().adminPassword : null;

  if (password === correctPassword) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false });
  }
}
