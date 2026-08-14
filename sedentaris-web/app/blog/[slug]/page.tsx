import type { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import BlogPostPage from '@/components/BlogCard'
import { postMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  return postMetadata(slug, 'ca')
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <>
      <NavBar />
      <BlogPostPage slug={slug} />
      <Footer />
    </>
  )
}
