import { jsonResponse } from "@/lib/jsonResponse";
import Setting from "@/models/settings";
import cloudinary from "@/lib/cloudinary";

export const POST = async (req) => {
    try {
        const formData = await req.formData();

        // Extract fields
        const namaWebsite = formData.get('namaWebsite');
        const keyword = formData.get('keyword');
        const description = formData.get('description');
        const favicon = formData.get('favicon');
        const logo = formData.get('logo');

        const transaction = await Setting.sequelize.transaction();

        try {
            // Buat record settings baru
            const newSetting = await Setting.create(
                {
                    namaWebsite,
                    keyword,
                    description,
                },
                { transaction }
            );

            // Upload favicon jika ada
            if (favicon && favicon.size > 0) {
                const faviconBuffer = await favicon.arrayBuffer();
                const faviconBase64 = Buffer.from(faviconBuffer).toString('base64');

                const faviconUpload = await cloudinary.uploader.upload(
                    `data:${favicon.type};base64,${faviconBase64}`,
                    {
                        folder: 'settings',
                        public_id: `favicon_${newSetting.id}`,
                    }
                );

                await Setting.update(
                    { favicon: faviconUpload.secure_url },
                    { where: { id: newSetting.id }, transaction }
                );
            }

            // Upload logo jika ada
            if (logo && logo.size > 0) {
                const logoBuffer = await logo.arrayBuffer();
                const logoBase64 = Buffer.from(logoBuffer).toString('base64');

                const logoUpload = await cloudinary.uploader.upload(
                    `data:${logo.type};base64,${logoBase64}`,
                    {
                        folder: 'settings',
                        public_id: `logo_${newSetting.id}`,
                    }
                );

                await Setting.update(
                    { logo: logoUpload.secure_url },
                    { where: { id: newSetting.id }, transaction }
                );
            }

            await transaction.commit();

            return jsonResponse(
                { statusCode: 201, msg: "Settings berhasil disimpan", data: { id: newSetting.id } },
                201
            );
        } catch (error) {
            await transaction.rollback();
            console.error('Error saving settings:', error);
            return jsonResponse({ msg: "Error saving settings" }, 500);
        }
    } catch (error) {
        console.error('Error processing form data:', error);
        return jsonResponse({ msg: "Error processing form data" }, 500);
    }
};


export const GET = async () => {
    try {
        const setting = await Setting.findOne({
            order: [['createdAt', 'DESC']],
        })

        if (!setting) {
            return jsonResponse({ msg: "Settings tidak ditemukan", data: null }, 404)
        }

        return jsonResponse({ msg: "Berhasil", data: setting }, 200)
    } catch (error) {
        console.error('Error fetching settings:', error)
        return jsonResponse({ msg: "Error fetching settings" }, 500)
    }
}