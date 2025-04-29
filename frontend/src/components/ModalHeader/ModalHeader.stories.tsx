import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ModalHeader } from './ModalHeader';

const meta = {
  title: 'UI/ModalHeader',
  component: ModalHeader,
  parameters: {
    layout: 'centered',
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof ModalHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Title',
    description: 'Description',
  },
};
