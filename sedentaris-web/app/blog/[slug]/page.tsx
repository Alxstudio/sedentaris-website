import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import BlogPostPage from '@/components/BlogCard'

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
