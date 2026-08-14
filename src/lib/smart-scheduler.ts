export interface ScheduleSlot {
  videoId: string;
  scheduledAt: Date;
  warning?: string;
}

export class SmartScheduler {
  /**
   * Calculates optimal publication slots for a batch of videos.
   * Example: "2 videos per day starting from 09:00 AM"
   */
  static calculateBatchSlots(
    videoIds: string[],
    videosPerDay: number = 2,
    startHour: number = 9,
    endHour: number = 22,
    existingBookedTimestamps: Date[] = []
  ): ScheduleSlot[] {
    const slots: ScheduleSlot[] = [];
    const dailyWindowHours = Math.max(1, endHour - startHour);
    const intervalHours = dailyWindowHours / Math.max(1, videosPerDay);

    const now = new Date();
    let currentDayOffset = 0;

    // Check if current time is already past startHour today
    if (now.getHours() >= startHour) {
      currentDayOffset = 0; // Can post later today if window available, else increment
    }

    const bookedTimesMs = new Set(existingBookedTimestamps.map((d) => d.getTime()));

    for (let i = 0; i < videoIds.length; i++) {
      const videoId = videoIds[i];
      const dayIndex = Math.floor(i / videosPerDay) + currentDayOffset;
      const slotIndexWithinDay = i % videosPerDay;

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + dayIndex);

      // Calculate Hour & Minute offset
      const totalOffsetHours = startHour + slotIndexWithinDay * intervalHours;
      const hour = Math.floor(totalOffsetHours);
      const minute = Math.round((totalOffsetHours - hour) * 60);

      targetDate.setHours(hour, minute, 0, 0);

      let adjustedDate = new Date(targetDate);
      let warning: string | undefined = undefined;

      // Rule 1: Window Restriction (06:00 AM to 22:00 PM)
      if (adjustedDate.getHours() >= endHour || adjustedDate.getHours() < 6) {
        adjustedDate.setDate(adjustedDate.getDate() + 1);
        adjustedDate.setHours(6, 0, 0, 0);
        warning = "Reagendado para 06:00 AM do dia seguinte por restrição de horário seguro.";
      }

      // Rule 2: Collision Avoidance
      while (bookedTimesMs.has(adjustedDate.getTime())) {
        adjustedDate.setHours(adjustedDate.getHours() + 1);
        warning = "Reagendado +1 hora para evitar colisão de postagem no mesmo canal.";
      }

      bookedTimesMs.add(adjustedDate.getTime());
      slots.push({
        videoId,
        scheduledAt: adjustedDate,
        warning,
      });
    }

    return slots;
  }
}
