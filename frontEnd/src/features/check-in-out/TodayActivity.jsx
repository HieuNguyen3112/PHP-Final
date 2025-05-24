import styled from "styled-components";
import Heading from "../../ui/Heading";
import Row from "../../ui/Row";
import Spinner from "../../ui/Spinner";
import TodayItem from "./TodayItem";
import { isSameDay, parseISO } from "date-fns";

const StyledToday = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  grid-column: 1 / span 2;
  padding-top: 2.4rem;
`;

const TodayList = styled.ul`
  overflow: scroll;
  overflow-x: hidden;

  /* Removing scrollbars for webkit, firefox, and ms, respectively */
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const NoActivity = styled.p`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  margin-top: 0.8rem;
`;

function TodayActivity({ activities = [] }) {
  const isLoading = false;
  const today = new Date();

  // Filter activities to only include unconfirmed or checked_in bookings for today
  const todayActivities = activities.filter(activity => {
    // Ensure we have valid data
    if (!activity.startDate && !activity.endDate) return false;
    
    // Check if this is a relevant status
    const isRelevantStatus =  activity.status === "unconfirmed" || activity.status === "checked_in";
    
    // For unconfirmed bookings, check if start date is today (arrivals)
    if (activity.status === "unconfirmed") {
      return isRelevantStatus && activity.startDate && isSameDay(parseISO(activity.startDate), today);
    }
    
    // For checked_in bookings, check if end date is today (departures)
    if (activity.status === "checked_in") {
      return isRelevantStatus && activity.startDate && isSameDay(parseISO(activity.startDate), today);
    }
    
    return false;
  });

  // Process activities to add country flag paths
  const processedActivities = todayActivities.map(activity => {
    // Ensure we have guest data
    if (!activity.guest) return activity;
    
    // Create country flag path - lowercase country code
    const country = activity.guest.country?.toLowerCase() || "vn";
    const countryFlag = `/flags/${country}.png`;
    
    return {
      ...activity,
      guest: {
        ...activity.guest,
        countryFlag
      }
    };
  });

  return (
    <StyledToday> 
      <Row type="horizontal">
        <Heading as="h2">Today</Heading>
      </Row>

      {!isLoading ? (
        processedActivities.length > 0 ? (
          <TodayList>
            {processedActivities.map((activity) => (
              <TodayItem activity={activity} key={activity.id} />
            ))}
          </TodayList>
        ) : (
          <NoActivity>No activity today...</NoActivity>
        )
      ) : (
        <Spinner />
      )}
    </StyledToday>
  );
}

export default TodayActivity;