import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAllCategories, createCategory } from '@/lib/db/models/blogCategory'

export async function GET() {
  try {
    const categories = await getAllCategories()
    return NextResponse.json(categories)
  } catch (error: any) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { name } = await req.json()
    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    const category = await createCategory(name)
    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Category already exists') {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }
    console.error('Failed to create category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
