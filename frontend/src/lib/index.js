const PricingDashboard = () => {
    const { spotPrices, loading, error, fetchSpotPrices } = useSpotPricesHook();
  
    // ... existing code ...
  
    return (
      <StyledDiv>
        {/* Your existing code here */}
        {loading && <p>Loading spot prices...</p>}
        {error && <p>Error fetching spot prices: {error}</p>}
        {spotPrices && (
          <div>
            {/* Pass spotPrices to the Ribbon component */}
            <Ribbon spotPrices={spotPrices} />
  
            {/* Continue with the rest of your PricingDashboard component */}
          </div>
        )}
      </StyledDiv>
    );
  };
  
  export default PricingDashboard;
  