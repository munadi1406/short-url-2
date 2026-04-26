'use server'
import Setting from '@/models/settings'

export const getLatestSettings = async () => {
    try {
        const setting = await Setting.findOne({
            order: [['createdAt', 'DESC']],
        })
        return setting ? JSON.parse(JSON.stringify(setting)) : null
    } catch (error) {
        console.error('Error fetching settings:', error)
        return null
    }
}