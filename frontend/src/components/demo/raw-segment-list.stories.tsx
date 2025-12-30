import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from '@storybook/test'
import { RawSegmentList } from './raw-segment-list'

const mockSegments = [
  {
    id: 'seg-1',
    speaker: 1,
    time: '0:00 – 0:18',
    rawText: 'Kulturnice nova galerija v Ljubljani je prostore dobila v stavbi v kateri je danes bancni muzej.',
  },
  {
    id: 'seg-2',
    speaker: 2,
    time: '0:19 – 0:42',
    rawText: 'Ta hisa je bila zgrajena se pravi zacetek gradnje je bilo leta 1903 in dokoncana je bila 1905.',
  },
  {
    id: 'seg-3',
    speaker: 1,
    time: '0:43 – 1:05',
    rawText: 'Mhm zelo zanimivo. In kaksna je bila prvotna namembnost te stavbe?',
  },
  {
    id: 'seg-4',
    speaker: 2,
    time: '1:06 – 1:30',
    rawText: 'Stavba je bila zgrajena kot poslovna stavba za Ljubljansko kreditno banko. Arhitekt je bil Josip Vancas.',
  },
]

const meta: Meta<typeof RawSegmentList> = {
  title: 'Demo/RawSegmentList',
  component: RawSegmentList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    onSegmentClick: fn(),
    onScroll: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ height: '400px', width: '500px', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof RawSegmentList>

export const Empty: Story = {
  args: {
    segments: [],
    activeSegmentId: null,
  },
}

export const SingleSegment: Story = {
  args: {
    segments: [mockSegments[0]],
    activeSegmentId: null,
  },
}

export const SingleActive: Story = {
  args: {
    segments: [mockSegments[0]],
    activeSegmentId: 'seg-1',
  },
}

export const MultipleSegments: Story = {
  args: {
    segments: mockSegments,
    activeSegmentId: null,
  },
}

export const MultipleWithActiveFirst: Story = {
  args: {
    segments: mockSegments,
    activeSegmentId: 'seg-1',
  },
}

export const MultipleWithActiveMiddle: Story = {
  args: {
    segments: mockSegments,
    activeSegmentId: 'seg-2',
  },
}

export const MultipleWithActiveLast: Story = {
  args: {
    segments: mockSegments,
    activeSegmentId: 'seg-4',
  },
}

export const MixedSpeakers: Story = {
  args: {
    segments: [
      { id: 'seg-1', speaker: 1, time: '0:00 – 0:15', rawText: 'Speaker one starts the conversation with an introduction.' },
      { id: 'seg-2', speaker: 2, time: '0:16 – 0:30', rawText: 'Speaker two responds with follow-up questions.' },
      { id: 'seg-3', speaker: 1, time: '0:31 – 0:45', rawText: 'Speaker one provides more details and context.' },
      { id: 'seg-4', speaker: 3, time: '0:46 – 1:00', rawText: 'A third speaker joins the discussion with new perspectives.' },
    ],
    activeSegmentId: 'seg-2',
  },
}
