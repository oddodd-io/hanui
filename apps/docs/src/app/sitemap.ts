import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hanui.io';

  // Docs pages
  const docs = [
    'introduction',
    'installation',
    'quick-start',
    'colors',
    'typography',
    'spacing',
    'border-radius',
    'layout',
    'strategy',
  ];

  // All components
  const components = [
    'accordion',
    'alert',
    'alert-dialog',
    'aspect-ratio',
    'badge',
    'body',
    'breadcrumb',
    'button',
    'card',
    'carousel',
    'center',
    'checkbox',
    'code',
    'combobox',
    'container',
    'critical-alerts',
    'data-table',
    'date-input',
    'disclosure',
    'display',
    'dropdown-menu',
    'file-upload',
    'flex',
    'footer',
    'form-field',
    'grid',
    'header',
    'heading',
    'identifier',
    'image',
    'in-page-navigation',
    'input',
    'label',
    'link',
    'list',
    'main-menu',
    'masthead',
    'modal',
    'pagination',
    'progress',
    'radio',
    'section-heading-system',
    'select',
    'side-navigation',
    'sidebar',
    'simple-grid',
    'skeleton',
    'skiplink',
    'slider',
    'spinner',
    'stack',
    'step-indicator',
    'structured-list',
    'switch',
    'tabbars',
    'table',
    'tabs',
    'tag',
    'textarea',
    'toast',
    'tooltip',
    'visually-hidden',
    'wrap',
  ];

  // All blocks
  const blocks = [
    'account-recovery',
    'application-form',
    'area-chart',
    'bar-chart',
    'billing-address',
    'board-management',
    'contact-form',
    'empty-state',
    'error-page',
    'gov-login',
    'line-chart',
    'login-form',
    'media-gallery',
    'notification-settings',
    'otp-verify',
    'payment-card',
    'pie-chart',
    'pricing-table',
    'profile-card',
    'search-bar',
    'service-card-grid',
    'settings-section',
    'signup-form',
    'site-settings',
    'stats-card',
    'team-members',
    'trash-list',
    'user-management',
  ];

  const docsRoutes = docs.map((doc) => ({
    url: `${baseUrl}/docs/${doc}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const componentRoutes = components.map((component) => ({
    url: `${baseUrl}/components/${component}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const blockRoutes = blocks.map((block) => ({
    url: `${baseUrl}/blocks/${block}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/components`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blocks`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kits`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...docsRoutes,
    ...componentRoutes,
    ...blockRoutes,
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...getAllPosts().map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
