//copied

import ClientOnly from '@/app/api/ClientOnly';
import getCurrentUser from '@/app/api/actions/getCurrentUser';
import getListingbyID from '@/app/api/actions/getListingbyID';
import EmptyState from '@/app/components/EmptyState';
import ListingClient from './listingDates';
import getReservations from '@/app/api/actions/getReservations';

interface Iparams {
  listingId?: string;
}

const ListingPage = async ({ params }: { params: Iparams }) => {
  const listing = await getListingbyID(params);
  const currentUser = await getCurrentUser();
  const reserved = await getReservations(params);

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }
  return (
    <ClientOnly>
      <ListingClient
        listing={listing}
        // currentUser={currentUser}
        //  reservations={reserved}
        reserved={reserved}
      />
    </ClientOnly>
  );
};

export default ListingPage;