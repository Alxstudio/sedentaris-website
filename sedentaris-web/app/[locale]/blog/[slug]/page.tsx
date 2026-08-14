import type { Metadata } from 'next'
import BlogPostPage from '@/components/BlogCard'
import { postMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  return postMetadata(slug, 'es')
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params
  return <BlogPostPage slug={slug} />
}
