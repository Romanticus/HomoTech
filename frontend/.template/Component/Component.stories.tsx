import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Component } from './Component';

const meta = {
  title: 'UI/Component',
  component: Component,
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
