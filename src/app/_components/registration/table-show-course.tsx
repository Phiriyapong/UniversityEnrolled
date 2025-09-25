import { Day } from "@prisma/client";
import { memo, useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
Chart.defaults.backgroundColor = "#9BD0F5";
Chart.defaults.borderColor = "#fff";
Chart.defaults.color = "#fff";
interface Props {
  sectionTime: (
    | undefined
    | {
        sectionTimes: {
          date: Day;
          start_time: Date;
          end_time: Date;
        }[];
        course_name: string;
      }
  )[];
}

function TableShowCourse(props: Readonly<Props>) {
  const { sectionTime } = props;
  const chartRef = useRef<HTMLCanvasElement>(null);

  const [dataCourseList, setDataCourseList] = useState<
    Array<Record<string, string | Array<number>>>
  >([
    { y: "Monday" },
    { y: "Tuesday" },
    { y: "Wednesday" },
    { y: "Thursday" },
    { y: "Friday" },
  ]);

  useEffect(() => {
    if (!sectionTime) return;
    sectionTime.forEach((item) => {
      if (!item) return;
      const courseName = item.course_name;
      item.sectionTimes.forEach((sectionTime) => {
        const dayRaw = sectionTime.date;
        const day = convertDay(dayRaw);
        const startTime =
          sectionTime.start_time.getHours() -
          7 +
          sectionTime.start_time.getMinutes() / 60;
        const endTime =
          sectionTime.end_time.getHours() -
          7 +
          sectionTime.end_time.getMinutes() / 60;
        const index = dataCourseList.findIndex((item) => item.y === day);
        if (index === -1) return;
        const newTimeline = dataCourseList[index];
        if (!newTimeline) return;
        newTimeline[courseName] = [startTime, endTime];
        setDataCourseList((prev) => {
          const newPrev = [...prev];
          newPrev[index] = newTimeline;
          return newPrev;
        });
      });
    });
  }, [sectionTime]);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        datasets: sectionTime.map((item) => {
          const courseName = item?.course_name;
          return {
            label: courseName,
            data: dataCourseList,
            parsing: {
              xAxisKey: courseName,
            },
          };
        }),
      },
      options: {
        indexAxis: "y",
        responsive: true,

        scales: {
          x: {
            min: 8,
            max: 22,
            ticks: {
              stepSize: 1.0,
              callback(tickValue) {
                return tickValue + ":00";
              },
            },
          },
        },
      },
    });
    return () => {
      chart.destroy();
    };
  }, [dataCourseList]);

  const convertDay = (day: Day) => {
    switch (day) {
      case Day.Mon:
        return "Monday";
      case Day.Tue:
        return "Tuesday";
      case Day.Wed:
        return "Wednesday";
      case Day.Thu:
        return "Thursday";
      case Day.Fri:
        return "Friday";
    }
  };

  return (
    <div>
      <canvas ref={chartRef} />
    </div>
  );
}

export default memo(TableShowCourse);
