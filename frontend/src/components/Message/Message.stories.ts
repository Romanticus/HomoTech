import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Message } from './Message.tsx';

const meta = {
  title: 'UI/Message',
  component: Message,
  parameters: {
    layout: 'centered',
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Title',
    description: 'Description',
    action: 'Action',
  },
};
