import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Modal } from './Modal';

const meta = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onClose: fn(),
    header: 'Header',
    actions: 'Actions',
    children: 'Children',
    isPortal: false
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'Message',
    isError: false
  }
};

export const Error: Story = {
  args: {
    message: 'Error message',
    isError: true
  }
};
