export async function getSleepDataFromOraTech() {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  
    const now = new Date();
    const localDate = now.getFullYear() + "-"
      + String(now.getMonth() + 1).padStart(2, '0') + "-"
      + String(now.getDate()).padStart(2, '0');
  
    const localTime = now.getHours().toString().padStart(2, '0') + ":"
      + now.getMinutes().toString().padStart(2, '0');
  
    // Randomized realistic data
    const sleepScore = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
    const disturbances = Math.floor(Math.random() * 5);
    const totalMinutes = 450;
    const rem = Math.floor(Math.random() * (90 - 60) + 60);
    const deep = Math.floor(Math.random() * (120 - 90) + 90);
    const light = totalMinutes - rem - deep;
  
    return {
      date: localDate,
      sleepScore,
      startTime: "22:45",
      endTime: localTime,
      durationMinutes: totalMinutes,
      stages: {
        light,
        deep,
        rem,
      },
      disturbances,
      insights: [
        sleepScore >= 85
          ? "Excellent sleep! You’re well-rested."
          : sleepScore >= 70
          ? "Good sleep, but you can improve."
          : "Poor sleep quality detected. Let's work on it.",
        disturbances >= 3
          ? "Frequent disturbances impacted your deep sleep."
          : "Minimal disturbances detected. Good job!",
      ],
    };
  }
  