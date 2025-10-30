import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import type { SweetAlertOptions } from '../types'

const MySwal = withReactContent(Swal)

const isDark = (): boolean =>
    document.documentElement.getAttribute('data-color-mode') === 'dark'

export const confirm = (opts: SweetAlertOptions = {}) =>
    MySwal.fire({
        title: opts.title || 'Are you sure?',
        text: opts.text || '',
        icon: opts.icon || 'warning',
        showCancelButton: true,
        confirmButtonText: opts.confirmText || 'Confirm',
        cancelButtonText: opts.cancelText || 'Cancel',
        background: isDark() ? '#0B1020' : '#FFFFFF',
        color: isDark() ? '#E8ECF5' : '#0F172A',
        confirmButtonColor: '#7C3AED',
        cancelButtonColor: '#475569',
        customClass: {
            popup: 'swal2-rounded',
            title: 'swal2-strong',
        },
    })

export const alert = (opts: SweetAlertOptions = {}) =>
    MySwal.fire({
        title: opts.title || 'Done',
        text: opts.text || '',
        icon: opts.icon || 'success',
        background: isDark() ? '#0B1020' : '#FFFFFF',
        color: isDark() ? '#E8ECF5' : '#0F172A',
        confirmButtonColor: '#7C3AED',
    })