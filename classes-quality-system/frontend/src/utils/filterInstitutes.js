export function filterInstitutes(institutes, filters) {

    return institutes.filter((institute) => {

        const name =
            institute.name?.toLowerCase() || "";

        const search =
            filters.searchTerm.toLowerCase();

        const rating =
            Number(institute.rating) || 0;

        const fee =
            Number(institute.fee) || 0;

        const matchesSearch =
            name.includes(search);

        const matchesRating =
            rating >= filters.minimumRating;

        const matchesFee =
            filters.maxFee === "any" ||
            fee <= Number(filters.maxFee);

        const matchesVerified =
            !filters.verifiedOnly ||
            institute.verified === true;

        return (
            matchesSearch &&
            matchesRating &&
            matchesFee &&
            matchesVerified
        );
    });
}