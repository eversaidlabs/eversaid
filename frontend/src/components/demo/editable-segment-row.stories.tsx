import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'
import { EditableSegmentRow } from './editable-segment-row'

const defaultArgs = {
  id: 'seg-1',
  speaker: 1,
  time: '0:00 – 0:18',
  text: 'Kulturnice nova galerija v Ljubljani je prostore dobila v stavbi, v kateri je danes bančni muzej.',
  rawText: 'kulturnice nova galerija v ljubljani je prostore dobila v stavbi v kateri je danes bancni muzej',
  editedText: 'Kulturnice nova galerija v Ljubljani je prostore dobila v stavbi, v kateri je danes bančni muzej.',
  isActive: false,
  isReverted: false,
  isEditing: false,
  hasUnsavedEdits: false,
  showDiff: false,
  spellcheckErrors: [],
  activeSuggestion: null,
  onRevert: fn(),
  onUndoRevert: fn(),
  onSave: fn(),
  onEditStart: fn(),
  onEditCancel: fn(),
  onTextChange: fn(),
  onWordClick: fn(),
  onSuggestionSelect: fn(),
  onCloseSuggestions: fn(),
}

const meta: Meta<typeof EditableSegmentRow> = {
  title: 'Demo/EditableSegmentRow',
  component: EditableSegmentRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: defaultArgs,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '600px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof EditableSegmentRow>

export const ViewMode: Story = {
  args: {
    ...defaultArgs,
  },
}

export const ViewModeActive: Story = {
  args: {
    ...defaultArgs,
    isActive: true,
  },
}

export const EditingMode: Story = {
  args: {
    ...defaultArgs,
    isEditing: true,
    isActive: true,
  },
}

export const EditingWithSpellcheckErrors: Story = {
  args: {
    ...defaultArgs,
    isEditing: true,
    isActive: true,
    editedText: 'Kulturnice nova galerija v Ljubjani je prostore dobila.',
    spellcheckErrors: [
      {
        word: 'Ljubjani',
        start: 27,
        end: 35,
        suggestions: ['Ljubljani', 'Ljubljena', 'Ljubljano'],
      },
    ],
  },
}

export const EditingWithSuggestionDropdown: Story = {
  args: {
    ...defaultArgs,
    isEditing: true,
    isActive: true,
    editedText: 'Kulturnice nova galerija v Ljubjani je prostore dobila.',
    spellcheckErrors: [
      {
        word: 'Ljubjani',
        start: 27,
        end: 35,
        suggestions: ['Ljubljani', 'Ljubljena', 'Ljubljano'],
      },
    ],
    activeSuggestion: {
      word: 'Ljubjani',
      position: { x: 200, y: 150 },
      suggestions: ['Ljubljani', 'Ljubljena', 'Ljubljano'],
    },
  },
}

export const RevertedState: Story = {
  args: {
    ...defaultArgs,
    isReverted: true,
    text: 'kulturnice nova galerija v ljubljani je prostore dobila v stavbi v kateri je danes bancni muzej',
  },
}

export const WithUnsavedEdits: Story = {
  args: {
    ...defaultArgs,
    hasUnsavedEdits: true,
  },
}

export const WithDiffShown: Story = {
  args: {
    ...defaultArgs,
    showDiff: true,
  },
}

export const Speaker1: Story = {
  args: {
    ...defaultArgs,
    speaker: 1,
    isActive: true,
  },
}

export const Speaker2: Story = {
  args: {
    ...defaultArgs,
    speaker: 2,
    isActive: true,
  },
}

export const Speaker3: Story = {
  args: {
    ...defaultArgs,
    speaker: 3,
    isActive: true,
  },
}

export const ActiveWithDiff: Story = {
  args: {
    ...defaultArgs,
    isActive: true,
    showDiff: true,
  },
}

export const ActiveWithUnsavedEdits: Story = {
  args: {
    ...defaultArgs,
    isActive: true,
    hasUnsavedEdits: true,
  },
}
