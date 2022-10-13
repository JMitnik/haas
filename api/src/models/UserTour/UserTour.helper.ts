import { maxBy } from 'lodash';
import { TourType } from 'prisma/prisma-client';
import { UserTour } from './UserTour.types';

export class UserTours {
  private tours: UserTour[];

  constructor(tours: UserTour[]) {
    this.tours = tours;
  }

  /**
   * Finds all feature tours 
   */
  public getFeatureTours() {
    const featureTours = this.tours.filter((tour) => tour.type === TourType.GUIDE);
    return featureTours;
  };

  /**
   * Finds the latest unseen release 
   */
  public getLatestRelease() {
    const releases = this.tours.filter((tour) => tour.type === TourType.RELEASE);
    const latest = maxBy(releases, (release) => release.createdAt) || null;

    // If there are no tours available OR the latest tour has already been seen => return null 
    // Else => return the latest unseen release
    return latest?.usersOfTour.length === 0 || latest?.usersOfTour?.[0]?.seenAt ? null : latest;
  };
}