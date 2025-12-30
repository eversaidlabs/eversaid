import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DiffSegmentDisplay } from './diff-segment-display'

const meta: Meta<typeof DiffSegmentDisplay> = {
  title: 'Demo/DiffSegmentDisplay',
  component: DiffSegmentDisplay,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    showDiff: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof DiffSegmentDisplay>

export const DiffDisabled: Story = {
  args: {
    rawText: 'Um hello world',
    cleanedText: 'Hello world',
    showDiff: false,
  },
}

export const DeletionsOnly: Story = {
  args: {
    rawText: 'Um hello uh world',
    cleanedText: 'hello world',
    showDiff: true,
  },
}

export const InsertionsOnly: Story = {
  args: {
    rawText: 'hello',
    cleanedText: 'Hello, world!',
    showDiff: true,
  },
}

export const MixedChanges: Story = {
  args: {
    rawText: "Uh so basically what we're um trying to do here is figure out the best approach",
    cleanedText: "So basically what we're trying to do here is figure out the best approach.",
    showDiff: true,
  },
}

export const IdenticalText: Story = {
  args: {
    rawText: 'Hello world',
    cleanedText: 'Hello world',
    showDiff: true,
  },
}

export const ComplexTranscript: Story = {
  args: {
    rawText: "kulturnice nova galerija v ljubljani je prostore dobila v stavbi v kateri je danes bancni",
    cleanedText: "Kulturnice nova galerija v Ljubljani je prostore dobila v stavbi, v kateri je danes bančni",
    showDiff: true,
  },
}
