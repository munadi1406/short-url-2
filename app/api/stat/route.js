import { VisitorStat } from "@/models/visistorStat";
import { NextResponse } from "next/server";

import { Op, Sequelize } from "sequelize";

export async function GET() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Total visitors
        const totalVisitors = await VisitorStat.count();

        // Visitors today
        const todayVisitors = await VisitorStat.count({
            where: {
                visitedAt: {
                    [Op.gte]: today,
                },
            },
        });

        // Grouped statistics by page (slug)
        const groupedStats = await VisitorStat.findAll({
            attributes: [
                "page",
                [Sequelize.fn("COUNT", Sequelize.col("id")), "totalVisitors"],
            ],
            group: ["page"],
        });

        // Combine all statistics into a single response
        return NextResponse.json({
            totalVisitors,
            todayVisitors,
            groupedStats,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to fetch statistics", error: error.message },
            { status: 500 }
        );
    }
}
