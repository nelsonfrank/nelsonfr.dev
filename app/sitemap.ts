import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'
import { projects } from '@/lib/projects'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nelsonfrank.dev'

  // Static routes configuration
  const routes = ['', '/experience', '/about', '/projects', '/writing'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // Dynamic project routes
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Dynamic blog post routes from Markdown posts
  const posts = getAllPosts().map((post) => {
    let lastModifiedDate = new Date()
    if (post.date) {
      const parsedDate = new Date(post.date)
      if (!isNaN(parsedDate.getTime())) {
        lastModifiedDate = parsedDate
      }
    }
    return {
      url: `${baseUrl}/writing/${post.slug}`,
      lastModified: lastModifiedDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }
  })

  return [...routes, ...projectRoutes, ...posts]
}
