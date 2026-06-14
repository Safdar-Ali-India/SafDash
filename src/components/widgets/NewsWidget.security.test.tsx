import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NewsWidget } from './NewsWidget'

const baseProps = {
  loading: false,
  error: null,
  source: 'devto' as const,
  onSourceChange: vi.fn(),
}

describe('NewsWidget security', () => {
  it('renders external links with noopener noreferrer', () => {
    render(
      <NewsWidget
        {...baseProps}
        devArticles={[
          {
            id: 1,
            title: 'Safe article',
            url: 'https://dev.to/safe',
            description: '',
            author: 'author',
            publishedAt: '2026-01-01',
            tags: [],
            reactions: 0,
            comments: 0,
          },
        ]}
        hnStories={[]}
      />
    )

    const link = screen.getByRole('link', { name: /safe article/i })
    expect(link).toHaveAttribute('href', 'https://dev.to/safe')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('does not render script tags from API titles as HTML', () => {
    const { container } = render(
      <NewsWidget
        {...baseProps}
        devArticles={[
          {
            id: 2,
            title: '<script>alert("xss")</script>Title',
            url: 'https://dev.to/x',
            description: '',
            author: 'author',
            publishedAt: '2026-01-01',
            tags: [],
            reactions: 0,
            comments: 0,
          },
        ]}
        hnStories={[]}
      />
    )

    expect(container.querySelector('script')).toBeNull()
    expect(screen.getByText('<script>alert("xss")</script>Title')).toBeInTheDocument()
  })

  it('switches news source tabs', async () => {
    const user = userEvent.setup()
    const onSourceChange = vi.fn()

    render(
      <NewsWidget
        {...baseProps}
        onSourceChange={onSourceChange}
        devArticles={[]}
        hnStories={[
          {
            id: 1,
            title: 'HN item',
            url: 'https://example.com',
            score: 10,
            by: 'user',
            time: 1700000000,
            descendants: 1,
          },
        ]}
      />
    )

    await user.click(screen.getByRole('button', { name: 'HN' }))
    expect(onSourceChange).toHaveBeenCalledWith('hackernews')
  })
})
