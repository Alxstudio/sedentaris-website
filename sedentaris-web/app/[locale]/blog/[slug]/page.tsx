import BlogPostPage from '@/components/BlogCard'

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params
  return <BlogPostPage slug={slug} />
}
