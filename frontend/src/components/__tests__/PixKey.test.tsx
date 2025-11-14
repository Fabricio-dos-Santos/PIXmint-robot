import React from 'react';
import { render, screen } from '@testing-library/react';
import PixKey from '../PixKey';

describe('PixKey component', () => {
  it('renders masked wallet and copy button', () => {
    const wallet = '0x1234567890abcdef12345';
    render(<PixKey value={wallet} />);

    // masked form should be present
    const masked = screen.getByText(/0x12345\.\.\./i);
    expect(masked).toBeInTheDocument();

    // copy button should exist (aria-label "Copy full value")
    const copyBtn = screen.getByRole('button', { name: /copy full value/i });
    expect(copyBtn).toBeInTheDocument();

    // label should be present by default
    expect(screen.getByText(/wallet/i)).toBeInTheDocument();
  });

  it('hides label when showLabel is false', () => {
    const wallet = '0x1234567890abcdef12345';
    render(<PixKey value={wallet} showLabel={false} />);
    expect(screen.queryByText(/wallet/i)).toBeNull();
  });
});
