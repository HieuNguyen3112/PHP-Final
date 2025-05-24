import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import styled from 'styled-components';
import useGetCabins from '../../api/useGetCabinsSmall';
import useCreateBooking from '../../api/useCreateBooking';
import useGetSettings from '../../api/useGetSettings';
import { useDarkMode } from '../../context/DarkModeContext';

// Styled components that properly respect dark mode
const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: var(--color-grey-0);
  border-radius: 8px;
  color: var(--color-grey-700);
`;

const FormTitle = styled.h2`
  color: var(--color-grey-700);
  margin-bottom: 20px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  width: 100%;
`;

const FormRow = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
  
  & > * {
    flex: 1;
    width: 100%;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 5px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: var(--color-grey-700);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-grey-300);
  border-radius: 4px;
  font-size: 16px;
  background-color: var(--color-grey-0);
  color: var(--color-grey-700);
  box-sizing: border-box;
  
  &:disabled {
    background-color: var(--color-grey-200);
    color: var(--color-grey-500);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-grey-300);
  border-radius: 4px;
  font-size: 16px;
  background-color: var(--color-grey-0);
  color: var(--color-grey-700);
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-grey-300);
  border-radius: 4px;
  font-size: 16px;
  height: 80px;
  resize: vertical;
  background-color: var(--color-grey-0);
  color: var(--color-grey-700);
`;

const FormActions = styled.div`
  margin-top: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const SubmitButton = styled.button`
  background: var(--color-brand-600);
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  
  &:hover:not(:disabled) {
    background: var(--color-brand-700);
  }
  
  &:disabled {
    background: var(--color-grey-400);
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background: var(--color-grey-400);
  color: var(--color-grey-0);
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  
  &:hover:not(:disabled) {
    background: var(--color-grey-500);
  }
  
  &:disabled {
    background: var(--color-grey-300);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: var(--color-red-100);
  color: var(--color-red-700);
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: var(--color-grey-500);
`;

// Country data for select dropdown
const countries = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AS", name: "American Samoa" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AI", name: "Anguilla" },
  { code: "AQ", name: "Antarctica" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AW", name: "Aruba" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas (the)" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BM", name: "Bermuda" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BQ", name: "Bonaire, Sint Eustatius and Saba" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BV", name: "Bouvet Island" },
  { code: "BR", name: "Brazil" },
  { code: "IO", name: "British Indian Ocean Territory" },
  { code: "BN", name: "Brunei Darussalam" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "CV", name: "Cabo Verde" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "KY", name: "Cayman Islands" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CX", name: "Christmas Island" },
  { code: "CC", name: "Cocos (Keeling) Islands" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CD", name: "Congo (Democratic Republic)" },
  { code: "CG", name: "Congo" },
  { code: "CK", name: "Cook Islands" },
  { code: "CR", name: "Costa Rica" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CW", name: "Curaçao" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czechia" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "SZ", name: "Eswatini" },
  { code: "ET", name: "Ethiopia" },
  { code: "FK", name: "Falkland Islands" },
  { code: "FO", name: "Faroe Islands" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GF", name: "French Guiana" },
  { code: "PF", name: "French Polynesia" },
  { code: "TF", name: "French Southern Territories" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GI", name: "Gibraltar" },
  { code: "GR", name: "Greece" },
  { code: "GL", name: "Greenland" },
  { code: "GD", name: "Grenada" },
  { code: "GP", name: "Guadeloupe" },
  { code: "GU", name: "Guam" },
  { code: "GT", name: "Guatemala" },
  { code: "GG", name: "Guernsey" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HM", name: "Heard Island and McDonald Islands" },
  { code: "VA", name: "Holy See" },
  { code: "HN", name: "Honduras" },
  { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IM", name: "Isle of Man" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JE", name: "Jersey" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KI", name: "Kiribati" },
  { code: "KP", name: "Korea (Democratic People's Republic)" },
  { code: "KR", name: "Korea (Republic)" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Lao People's Democratic Republic" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MO", name: "Macao" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MQ", name: "Martinique" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "YT", name: "Mayotte" },
  { code: "MX", name: "Mexico" },
  { code: "FM", name: "Micronesia" },
  { code: "MD", name: "Moldova" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MS", name: "Montserrat" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NC", name: "New Caledonia" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "NU", name: "Niue" },
  { code: "NF", name: "Norfolk Island" },
  { code: "MP", name: "Northern Mariana Islands" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PS", name: "Palestine" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PN", name: "Pitcairn" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "PR", name: "Puerto Rico" },
  { code: "QA", name: "Qatar" },
  { code: "MK", name: "Republic of North Macedonia" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russian Federation" },
  { code: "RW", name: "Rwanda" },
  { code: "RE", name: "Réunion" },
  { code: "BL", name: "Saint Barthélemy" },
  { code: "SH", name: "Saint Helena, Ascension and Tristan da Cunha" },
  { code: "KN", name: "Saint Kitts and Nevis" },
  { code: "LC", name: "Saint Lucia" },
  { code: "MF", name: "Saint Martin" },
  { code: "PM", name: "Saint Pierre and Miquelon" },
  { code: "VC", name: "Saint Vincent and the Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "Sao Tome and Principe" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" },
  { code: "SX", name: "Sint Maarten" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "GS", name: "South Georgia and the South Sandwich Islands" },
  { code: "SS", name: "South Sudan" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SJ", name: "Svalbard and Jan Mayen" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syrian Arab Republic" },
  { code: "TW", name: "Taiwan" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania" },
  { code: "TH", name: "Thailand" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TK", name: "Tokelau" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TC", name: "Turks and Caicos Islands" },
  { code: "TV", name: "Tuvalu" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "UM", name: "United States Minor Outlying Islands" },
  { code: "US", name: "United States of America" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Viet Nam" },
  { code: "VG", name: "Virgin Islands (British)" },
  { code: "VI", name: "Virgin Islands (U.S.)" },
  { code: "WF", name: "Wallis and Futuna" },
  { code: "EH", name: "Western Sahara" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
  { code: "AX", name: "Åland Islands" }
];

const BookingForm = ({ onClose, selectedCabinId = null }) => {
  // Get dark mode context
  const { isDarkMode } = useDarkMode();
  
  // Get cabins data using the hook
  const { cabins, isLoading: isLoadingCabins, error: cabinsError } = useGetCabins();
  
  // Get settings to determine max nights
  const { settings, isLoading: isLoadingSettings } = useGetSettings();
  
  // Get booking creation functionality
  const { 
    createBooking, 
    isCreating, 
    error: bookingError,
    calculateEndDate,
    calculateTotalAmount
  } = useCreateBooking();
  
  // State to store form data
  const [formData, setFormData] = useState({
    cabin_id: selectedCabinId || '',
    guest_email: '',
    guest_name: '',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    nights: 1,
    phone_number: '',
    address: '',
    national_id: '',
    country: '' // Default to empty, will be selected from dropdown
  });

  // Derived state for calculated values
  const [calculatedValues, setCalculatedValues] = useState({
    end_date: '',
    amount: 0
  });

  // Set initial cabin when data is loaded
  useEffect(() => {
    if (!isLoadingCabins && cabins.length > 0) {
      // If no cabin is pre-selected, select the first one
      if (!selectedCabinId && !formData.cabin_id) {
        const sortedCabins = [...cabins].sort((a, b) => a.name.localeCompare(b.name));
        const firstCabin = sortedCabins[0];
        
        setFormData(prev => ({
          ...prev,
          cabin_id: firstCabin.id
        }));
      }
    }
  }, [cabins, isLoadingCabins, selectedCabinId, formData.cabin_id]);

  // Update end date and amount when start date, nights or cabin changes
  useEffect(() => {
    if (formData.start_date && formData.nights > 0) {
      // Calculate end date
      const endDate = calculateEndDate(formData.start_date, formData.nights);
      
      // Find selected cabin
      const selectedCabin = cabins.find(
        cabin => cabin.id === parseInt(formData.cabin_id)
      );
      
      // Calculate amount
      const amount = calculateTotalAmount(selectedCabin, formData.nights);
      
      setCalculatedValues({
        end_date: endDate,
        amount: amount
      });
    }
  }, [formData.start_date, formData.nights, formData.cabin_id, cabins, calculateEndDate, calculateTotalAmount]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await createBooking(formData, cabins);
      
      if (result && result.success) {
        // Show success message as an alert
        alert('Booking created successfully!');
        
        // Close modal if provided
        if (onClose) {
          onClose();
        }
        
        // Refresh the page
        window.location.reload();
      }
    } catch (error) {
      // Error is already handled in the hook
      console.error("Form submission failed");
    }
  };

  // Show loading state
  if (isLoadingCabins || isLoadingSettings) {
    return <LoadingMessage>Loading data...</LoadingMessage>;
  }

  // Show error if cabins couldn't be loaded
  if (cabinsError) {
    return <ErrorMessage>Error: {cabinsError}</ErrorMessage>;
  }

  // Get max nights from settings or use default
  const maxNights = settings?.maxBookingLength || 30;

  // Sort cabins by name
  const sortedCabins = [...cabins].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <FormContainer>
      <FormTitle>Create New Booking</FormTitle>
      
      {bookingError && (
        <ErrorMessage>
          {bookingError}
        </ErrorMessage>
      )}
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="cabin_id">Cabin</Label>
          <Select 
            id="cabin_id" 
            name="cabin_id" 
            value={formData.cabin_id} 
            onChange={handleChange}
            required
          >
            <option value="">Select a cabin</option>
            {sortedCabins.map(cabin => (
              <option key={cabin.id} value={cabin.id}>
                {cabin.name} - ${cabin.regularPrice} {cabin.discount > 0 && `(${cabin.discount}% off)`}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="guest_name">Guest Name</Label>
          <Input 
            type="text" 
            id="guest_name" 
            name="guest_name" 
            value={formData.guest_name} 
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="guest_email">Email Address</Label>
          <Input 
            type="email" 
            id="guest_email" 
            name="guest_email" 
            value={formData.guest_email} 
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormRow>
          <FormGroup>
            <Label htmlFor="start_date">Check-in Date</Label>
            <Input 
              type="date" 
              id="start_date" 
              name="start_date" 
              value={formData.start_date} 
              onChange={handleChange}
              min={format(new Date(), 'yyyy-MM-dd')}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="nights">Number of Nights</Label>
            <Input 
              type="number" 
              id="nights" 
              name="nights" 
              value={formData.nights} 
              onChange={handleChange}
              min="1"
              max={maxNights}
              required
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label htmlFor="end_date">Check-out Date (Calculated)</Label>
            <Input 
              type="date" 
              id="end_date" 
              value={calculatedValues.end_date} 
              disabled
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="amount">Total Amount ($)</Label>
            <Input 
              type="number" 
              id="amount" 
              value={calculatedValues.amount} 
              disabled
            />
          </FormGroup>
        </FormRow>

        <FormGroup>
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input 
            type="tel" 
            id="phone_number" 
            name="phone_number" 
            value={formData.phone_number} 
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="address">Address</Label>
          <TextArea 
            id="address" 
            name="address" 
            value={formData.address} 
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormRow>
          <FormGroup>
            <Label htmlFor="national_id">National ID</Label>
            <Input 
              type="text" 
              id="national_id" 
              name="national_id" 
              value={formData.national_id} 
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="country">Country</Label>
            <Select 
              id="country" 
              name="country" 
              value={formData.country} 
              onChange={handleChange}
              required
            >
              <option value="">Select a country</option>
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </Select>
          </FormGroup>
        </FormRow>

        <FormActions>
          {onClose && (
            <CancelButton 
              type="button" 
              onClick={onClose}
              disabled={isCreating}
            >
              Cancel
            </CancelButton>
          )}
          <SubmitButton 
            type="submit" 
            disabled={isCreating}
          >
            {isCreating ? 'Creating Booking...' : 'Create Booking'}
          </SubmitButton>
        </FormActions>
      </form>
    </FormContainer>
  );
};

export default BookingForm;