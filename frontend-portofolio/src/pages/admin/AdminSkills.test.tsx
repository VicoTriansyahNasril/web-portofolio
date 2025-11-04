import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AdminSkills from './AdminSkills';

const renderComponent = () => {
    render(
        <BrowserRouter>
            <AdminSkills />
        </BrowserRouter>
    );
};

describe('AdminSkills Page', () => {
    it('should render loading state initially then display skills', async () => {
        renderComponent();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(await screen.findByText('React')).toBeInTheDocument();
        expect(screen.getByText('Go')).toBeInTheDocument();
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('should open the form modal when "Tambah Skill" button is clicked', async () => {
        const user = userEvent.setup();
        renderComponent();

        const addButton = await screen.findByRole('button', { name: /tambah skill/i });
        await user.click(addButton);

        expect(await screen.findByRole('heading', { name: /add skill/i })).toBeInTheDocument();
    });
});