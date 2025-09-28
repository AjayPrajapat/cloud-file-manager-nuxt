import type { FileItem, FolderItem, TagItem, User, VersionEntry } from '../types'

export const sampleUsers: User[] = [
  {
    id: 'u-admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    name: 'Ada Admin'
  },
  {
    id: 'u-jane',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    name: 'Jane Analyst'
  }
]

export const sampleFolders: FolderItem[] = [
  {
    id: 'root',
    name: 'Root',
    parentId: null,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString(),
    ownerId: 'u-admin'
  },
  {
    id: 'finance',
    name: 'Finance',
    parentId: 'root',
    createdAt: new Date('2024-02-04').toISOString(),
    updatedAt: new Date('2024-02-20').toISOString(),
    ownerId: 'u-admin'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    parentId: 'root',
    createdAt: new Date('2024-02-10').toISOString(),
    updatedAt: new Date('2024-03-01').toISOString(),
    ownerId: 'u-jane'
  },
  {
    id: 'design-assets',
    name: 'Design Assets',
    parentId: 'marketing',
    createdAt: new Date('2024-02-15').toISOString(),
    updatedAt: new Date('2024-03-02').toISOString(),
    ownerId: 'u-jane'
  }
]

const loremSummary = 'Quarterly performance report summarizing revenue, expenses, and forecasts.'

export const sampleVersions: VersionEntry[] = [
  {
    id: 'ver-1',
    fileId: 'file-001',
    version: 1,
    createdAt: new Date('2024-03-01T10:00:00Z').toISOString(),
    metadata: {
      summary: loremSummary,
      tags: ['finance', 'q1'],
      ocrText: ''
    },
    location: {
      bucket: 'mock-bucket',
      path: 'reports/q1-report-v1.pdf'
    }
  },
  {
    id: 'ver-2',
    fileId: 'file-001',
    version: 2,
    createdAt: new Date('2024-03-05T10:00:00Z').toISOString(),
    metadata: {
      summary: 'Updated with board-approved forecasts.',
      tags: ['finance', 'board'],
      ocrText: ''
    },
    location: {
      bucket: 'mock-bucket',
      path: 'reports/q1-report-v2.pdf'
    }
  }
]

export const sampleTags: TagItem[] = [
  { id: 'tag-finance', name: 'Finance', color: '#7c3aed' },
  { id: 'tag-report', name: 'Report', color: '#0ea5e9' },
  { id: 'tag-design', name: 'Design', color: '#22c55e' },
  { id: 'tag-ai', name: 'AI Generated', color: '#f59e0b' }
]

export const sampleFiles: FileItem[] = [
  {
    id: 'file-001',
    name: 'Q1 Financial Report.pdf',
    type: 'application/pdf',
    size: 1024 * 1024 * 2,
    folderId: 'finance',
    ownerId: 'u-admin',
    createdAt: new Date('2024-03-05T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-03-05T10:00:00Z').toISOString(),
    tags: ['tag-finance', 'tag-report'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=400&q=60',
    versions: sampleVersions.filter(v => v.fileId === 'file-001'),
    metadata: {
      summary: loremSummary,
      aiSummary: 'Revenue grew 12% YoY with notable savings in operations.',
      aiTags: ['growth', 'forecast'],
      ocrText: ''
    },
    storage: {
      bucket: 'mock-bucket',
      path: 'reports/q1-report-v2.pdf',
      url: 'https://example.com/reports/q1-report.pdf'
    }
  },
  {
    id: 'file-002',
    name: 'Brand Guidelines.md',
    type: 'text/markdown',
    size: 1024 * 58,
    folderId: 'design-assets',
    ownerId: 'u-jane',
    createdAt: new Date('2024-02-18T12:30:00Z').toISOString(),
    updatedAt: new Date('2024-02-18T12:30:00Z').toISOString(),
    tags: ['tag-design'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=60',
    versions: [],
    metadata: {
      summary: 'Guidelines for the company branding system.',
      aiSummary: 'Logo, typography, and tone-of-voice reference.',
      aiTags: ['branding'],
      ocrText: '# Brand Guidelines\nUse the provided assets for marketing.'
    },
    storage: {
      bucket: 'mock-bucket',
      path: 'design/brand-guidelines.md',
      url: 'https://raw.githubusercontent.com/nuxt/nuxt.js/main/README.md'
    }
  },
  {
    id: 'file-003',
    name: 'Team Photo.jpg',
    type: 'image/jpeg',
    size: 1024 * 210,
    folderId: 'marketing',
    ownerId: 'u-jane',
    createdAt: new Date('2024-03-02T16:45:00Z').toISOString(),
    updatedAt: new Date('2024-03-02T16:45:00Z').toISOString(),
    tags: ['tag-design', 'tag-ai'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=400&q=60',
    versions: [],
    metadata: {
      summary: 'Marketing team photo for campaign launch.',
      aiSummary: 'Image contains four people collaborating around a table.',
      aiTags: ['team', 'people'],
      ocrText: ''
    },
    storage: {
      bucket: 'mock-bucket',
      path: 'marketing/team-photo.jpg',
      url: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80'
    }
  }
]
