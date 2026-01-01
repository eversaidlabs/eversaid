import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'
import { AudioPlayer } from './audio-player'

const meta: Meta<typeof AudioPlayer> = {
  title: 'Demo/AudioPlayer',
  component: AudioPlayer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onPlayPause: fn(),
    onSeek: fn(),
    onSpeedChange: fn(),
    onToggleSpeedMenu: fn(),
    onDownload: fn(),
  },
}

export default meta
type Story = StoryObj<typeof AudioPlayer>

export const Paused: Story = {
  args: {
    isPlaying: false,
    currentTime: 0,
    duration: 300,
    playbackSpeed: 1,
    showSpeedMenu: false,
  },
}

export const Playing: Story = {
  args: {
    isPlaying: true,
    currentTime: 45,
    duration: 300,
    playbackSpeed: 1,
    showSpeedMenu: false,
  },
}

export const Midway: Story = {
  args: {
    isPlaying: true,
    currentTime: 150,
    duration: 300,
    playbackSpeed: 1,
    showSpeedMenu: false,
  },
}

export const NearEnd: Story = {
  args: {
    isPlaying: true,
    currentTime: 295,
    duration: 300,
    playbackSpeed: 1,
    showSpeedMenu: false,
  },
}

export const SpeedMenuOpen: Story = {
  args: {
    isPlaying: false,
    currentTime: 60,
    duration: 300,
    playbackSpeed: 1,
    showSpeedMenu: true,
  },
}

export const Speed05x: Story = {
  args: {
    isPlaying: true,
    currentTime: 60,
    duration: 300,
    playbackSpeed: 0.5,
    showSpeedMenu: false,
  },
}

export const Speed15x: Story = {
  args: {
    isPlaying: true,
    currentTime: 60,
    duration: 300,
    playbackSpeed: 1.5,
    showSpeedMenu: false,
  },
}

export const Speed2x: Story = {
  args: {
    isPlaying: true,
    currentTime: 60,
    duration: 300,
    playbackSpeed: 2,
    showSpeedMenu: false,
  },
}

export const LongAudio: Story = {
  args: {
    isPlaying: false,
    currentTime: 3723,
    duration: 5400,
    playbackSpeed: 1,
    showSpeedMenu: false,
  },
}
