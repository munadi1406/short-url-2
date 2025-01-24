// app/api/logs/route.js
 
import Log from '@/models/Log';
import { VisitorStat } from '@/models/visistorStat';
import { NextResponse } from 'next/server';
import { Sequelize } from 'sequelize';

// Fungsi untuk menyimpan log baru atau memperbarui log yang sudah ada
export async function POST(request) {
  try {
    // Ambil data dari body request
    const { session_id, status, ip_address,  referer, user_agent, os } = await request.json();
    console.log({status})
    // Validasi data yang diterima
    if (!session_id || !status || !ip_address  || !user_agent || !os) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Cari log berdasarkan session_id
    const existingLog = await Log.findOne({ where: { session_id } });

    if (existingLog) {
      // Jika log sudah ada, kita lakukan update
      const updatedLog = await existingLog.update({
        status,  // Update status
        ip_address,  // Update ip address jika perlu
        referer,  // Update referer
        user_agent,  // Update user agent
        os,  // Update OS
        last_activity: new Date(),  // Update waktu terakhir aktivitas
      });

      return NextResponse.json(updatedLog, { status: 200 });
    } else {
      // Jika log belum ada, buat entri log baru
      const newLog = await Log.create({
        session_id,
        status,
        ip_address,
        referer,
        user_agent,
        os,
      });

      return NextResponse.json(newLog, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating/updating log:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Waktu server saat ini
    const serverTime = new Date();
    const today = new Date(serverTime); // Salin waktu server untuk perhitungan hari ini
    today.setHours(0, 0, 0, 0); // Set ke awal hari (00:00:00)

    // Tambahkan variabel akhir hari
    const endOfToday = new Date(today);
    endOfToday.setDate(endOfToday.getDate() + 1); // 00:00:00 hari berikutnya

    // Waktu tambahan untuk batas per bulan dan per tahun
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Awal bulan ini
    const startOfYear = new Date(today.getFullYear(), 0, 1); // Awal tahun ini

    // Hitung waktu tambahan (jam, tanggal, tahun)
    const currentHour = serverTime.getHours();
    const currentDate = serverTime.toLocaleDateString("en-GB"); // Format DD/MM/YYYY
    const currentYear = serverTime.getFullYear();

    // Eksekusi query paralel menggunakan Promise.allSettled
    const results = await Promise.allSettled([
      // Jumlah user aktif hari ini
      Log.count({
        where: {
          status: "active",
          updated_at: {
            [Sequelize.Op.gte]: today,
          },
        },
      }),

      // Jumlah user baru hari ini
      Log.count({
        where: {
          created_at: {
            [Sequelize.Op.gte]: today,
          },
        },
      }),

      // Jumlah user yang kembali hari ini
      Log.count({
        where: {
          status: "active",
          updated_at: {
            [Sequelize.Op.gte]: today,
          },
          created_at: {
            [Sequelize.Op.lt]: today,
          },
        },
      }),

      // Rata-rata waktu sesi
      Log.findAll({
        attributes: [
          [
            Sequelize.fn(
              "AVG",
              Sequelize.literal(
                "TIMESTAMPDIFF(SECOND, entry_time, IFNULL(exit_time, NOW()))"
              )
            ),
            "averageTime",
          ],
        ],
        where: {
          updated_at: {
            [Sequelize.Op.gte]: today,
          },
        },
      }),

      // Jumlah visitor hari ini
      VisitorStat.count({
        where: {
          visitedAt: {
            [Sequelize.Op.gte]: today,
          },
        },
      }),

      // Top path yang paling banyak dikunjungi hari ini
      VisitorStat.findAll({
        attributes: [
          "page",
          [Sequelize.fn("COUNT", Sequelize.col("page")), "visitCount"],
        ],
        where: {
          visitedAt: {
            [Sequelize.Op.gte]: today,
          },
        },
        group: ["page"],
        order: [[Sequelize.fn("COUNT", Sequelize.col("page")), "DESC"]],
        limit: 5,
      }),

      // Jumlah visitor per jam hari ini
      VisitorStat.findAll({
        attributes: [
          [Sequelize.fn("HOUR", Sequelize.col("visitedAt")), "hour"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "visitCount"],
        ],
        where: {
          visitedAt: {
            [Sequelize.Op.gte]: today,
            [Sequelize.Op.lt]: endOfToday,
          },
        },
        group: [Sequelize.fn("HOUR", Sequelize.col("visitedAt"))],
        order: [[Sequelize.fn("HOUR", Sequelize.col("visitedAt")), "ASC"]],
      }),

      // Jumlah visitor per hari bulan ini
      VisitorStat.findAll({
        attributes: [
          [Sequelize.literal("DAY(visitedAt)"), "day"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "visitCount"],
        ],
        where: {
          visitedAt: {
            [Sequelize.Op.gte]: startOfMonth,
            [Sequelize.Op.lt]: endOfToday, // Hingga akhir hari ini
          },
        },
        group: [Sequelize.literal("DAY(visitedAt)")],
        order: [[Sequelize.literal("DAY(visitedAt)"), "ASC"]],
      }),

      // Jumlah visitor per bulan dalam tahun ini
      VisitorStat.findAll({
        attributes: [
          [Sequelize.literal("MONTH(visitedAt)"), "month"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "visitCount"],
        ],
        where: {
          visitedAt: {
            [Sequelize.Op.gte]: startOfYear,
            [Sequelize.Op.lt]: endOfToday,
          },
        },
        group: [Sequelize.literal("MONTH(visitedAt)")],
        order: [[Sequelize.literal("MONTH(visitedAt)"), "ASC"]],
      }),

      // Jumlah visitor per tahun
      VisitorStat.findAll({
        attributes: [
          [Sequelize.literal("YEAR(visitedAt)"), "year"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "visitCount"],
        ],
        group: [Sequelize.literal("YEAR(visitedAt)")],
        order: [[Sequelize.literal("YEAR(visitedAt)"), "ASC"]],
      }),

      // Jumlah total user hari ini (baik aktif atau tidak)
      Log.count({
        where: {
          created_at: {
            [Sequelize.Op.gte]: today,
          },
        },
      }),
    ]);

    // Parsing hasil query
    const [
      activeUsersResult,
      newUsersResult,
      returningUsersResult,
      averageSessionTimeResult,
      todayVisitorsResult,
      topPathsResult,
      visitorsPerHourResult,
      visitorsPerDayThisMonthResult,
      visitorsPerMonthThisYearResult,
      visitorsPerYearResult,
      totalUsersTodayResult, // Hasil query total user hari ini
    ] = results;

    // Ambil data atau default ke nilai 0
    const activeUsersCount =
      activeUsersResult.status === "fulfilled" ? activeUsersResult.value : 0;
    const newUsersCount =
      newUsersResult.status === "fulfilled" ? newUsersResult.value : 0;
    const returningUsersCount =
      returningUsersResult.status === "fulfilled"
        ? returningUsersResult.value
        : 0;
    const totalUsersTodayCount =
      totalUsersTodayResult.status === "fulfilled"
        ? totalUsersTodayResult.value
        : 0; // Ambil data untuk total user hari ini

    // Hitung rata-rata waktu sesi
    const averageTimeSeconds =
      averageSessionTimeResult.status === "fulfilled"
        ? averageSessionTimeResult.value[0]?.dataValues?.averageTime || 0
        : 0;
    const hours = Math.floor(averageTimeSeconds / 3600);
    const minutes = Math.floor((averageTimeSeconds % 3600) / 60);
    const seconds = Math.floor(averageTimeSeconds % 60);
    const formattedAverageTime = `${hours}h ${minutes}m ${seconds}s`;

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return NextResponse.json(
      {
        serverTime: serverTime.toISOString(),
        currentHour,
        currentDate,
        currentYear,
        activeUsers: activeUsersCount,
        newUsers: newUsersCount,
        returningUsers: returningUsersCount,
        totalUsersToday: totalUsersTodayCount, // Menambahkan total user hari ini
        averageSessionTime: formattedAverageTime,
        todayVisitors:
          todayVisitorsResult.status === "fulfilled"
            ? todayVisitorsResult.value
            : 0,
        topPaths:
          topPathsResult.status === "fulfilled"
            ? topPathsResult.value.map((path) => ({
                page: path.page,
                visitCount: path.dataValues.visitCount,
              }))
            : [],
        visitorsPerHour:
          visitorsPerHourResult.status === "fulfilled"
            ? visitorsPerHourResult.value.map((v) => ({
                hour: String(v.dataValues.hour).padStart(2, "0"),
                visitCount: v.dataValues.visitCount,
              }))
            : [],
        visitorsPerDayThisMonth:
          visitorsPerDayThisMonthResult.status === "fulfilled"
            ? visitorsPerDayThisMonthResult.value.map((v) => ({
                day: v.dataValues.day,
                visitCount: v.dataValues.visitCount,
              }))
            : [],
        visitorsPerMonthThisYear:
          visitorsPerMonthThisYearResult.status === "fulfilled"
            ? visitorsPerMonthThisYearResult.value.map((v) => ({
                month: months[v.dataValues.month - 1],
                visitCount: v.dataValues.visitCount,
              }))
            : [],
        visitorsPerYear:
          visitorsPerYearResult.status === "fulfilled"
            ? visitorsPerYearResult.value.map((v) => ({
                year: v.dataValues.year,
                visitCount: v.dataValues.visitCount,
              }))
            : [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses permintaan." },
      { status: 500 }
    );
  }
}








