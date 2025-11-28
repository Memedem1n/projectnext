import { describe, it, expect } from 'vitest'
import { cn, formatDate } from '../utils'

describe('utils', () => {
    describe('cn', () => {
        it('should merge class names correctly', () => {
            expect(cn('c-1', 'c-2')).toBe('c-1 c-2')
        })

        it('should handle conditional classes', () => {
            expect(cn('c-1', true && 'c-2', false && 'c-3')).toBe('c-1 c-2')
        })

        it('should merge tailwind classes correctly', () => {
            expect(cn('p-4', 'p-2')).toBe('p-2')
        })
    })

    describe('formatDate', () => {
        it('should format date correctly for TR locale', () => {
            const date = new Date('2023-01-01')
            // Note: The exact output might depend on the environment's locale data, 
            // but usually '1 Ocak 2023' for tr-TR
            expect(formatDate(date)).toMatch(/1 Ocak 2023/)
        })

        it('should handle string input', () => {
            expect(formatDate('2023-01-01')).toMatch(/1 Ocak 2023/)
        })
    })
})
