
export enum Gender {
  Male = 0,
  Female = 1,
}

export enum BloodType {
  APositive = 0,
  ANegative = 1,
  BPositive = 2,
  BNegative = 3,
  ABPositive = 4,
  ABNegative = 5,
  OPositive = 6,
  ONegative = 7,
}

/** Mokeb.Domain.Model.Enums.State */
export enum RequestState {
  Accepted = 0,
  Rejected = 1,
  Requested = 2,
  DelayInEntrance = 3,
  DelayInExit = 4,
  Entered = 5,
  Exited = 6,
}

export type ApiEnvelope<T> = {
  success?: boolean;
  Success?: boolean;
  result?: T;
  Result?: T;
  response?: T;
  Response?: T;
  errors?: string[] | null;
  Errors?: string[] | null;
  errorMessage?: string | null;
  ErrorMessage?: string | null;
};

export type LoginResult = {
  principalId?: string;
  PrincipalId?: string;
  jwsCode?: string;
  JwsCode?: string;
};

export type IndividualPrincipalDto = {
  id?: string;
  Id?: string;
  /** LookingOnIndividuals / PrincipalDto / CaravanPrincipalDto */
  principalId?: string;
  PrincipalId?: string;
  name?: string | null;
  Name?: string | null;
  familyName?: string | null;
  FamilyName?: string | null;
  fullName?: string | null;
  FullName?: string | null;
  nationalCode?: string | null;
  NationalCode?: string | null;
  dateOfBirth?: string | null;
  DateOfBirth?: string | null;
  /** Enum number, or string "Male"/"Female" from PrincipalDto.Gender.ToString() */
  gender?: Gender | string;
  Gender?: Gender | string;
  passportNumber?: string | null;
  PassportNumber?: string | null;
  gmail?: string | null;
  Gmail?: string | null;
  phoneNumber?: string | null;
  PhoneNumber?: string | null;
  emergencyPhoneNumber?: string | null;
  EmergencyPhoneNumber?: string | null;
  bloodType?: BloodType;
  BloodType?: BloodType;
  username?: string | null;
  Username?: string | null;
  isActive?: boolean;
  IsActive?: boolean;
};

export type CompanionDto = {
  id?: string;
  Id?: string;
  companionId?: string;
  CompanionId?: string;
  name?: string | null;
  Name?: string | null;
  familyName?: string | null;
  FamilyName?: string | null;
  nationalCode?: string | null;
  NationalCode?: string | null;
  passportNumber?: string | null;
  PassportNumber?: string | null;
  dateOfBirth?: string | null;
  DateOfBirth?: string | null;
  phoneNumber?: string | null;
  PhoneNumber?: string | null;
  emergencyPhoneNumber?: string | null;
  EmergencyPhoneNumber?: string | null;
  gender?: Gender;
  Gender?: Gender;
};

export type RequestDto = {
  id?: string;
  Id?: string;
  requestId?: string;
  RequestId?: string;
  enterTime?: string;
  EnterTime?: string;
  exitTime?: string;
  ExitTime?: string;
  state?: number;
  State?: number;
  stringState?: string | null;
  StringState?: string | null;
  travelersAmount?: number;
  TravelersAmount?: number;
  maleAmount?: number;
  MaleAmount?: number;
  femaleAmount?: number;
  FemaleAmount?: number;
  travelers?: TravelerDto[] | null;
  Travelers?: TravelerDto[] | null;
  reservationCode?: string | null;
  ReservationCode?: string | null;
};

export type TravelerDto = {
  name?: string | null;
  Name?: string | null;
  /** ReserveRoom TravelerDto uses LastName; entity Travelers uses FamilyName. */
  lastName?: string | null;
  LastName?: string | null;
  familyName?: string | null;
  FamilyName?: string | null;
  gender?: Gender;
  Gender?: Gender;
  phoneNumber?: string | null;
  PhoneNumber?: string | null;
  emergencyPhoneNumber?: string | null;
  EmergencyPhoneNumber?: string | null;
  nationalCode?: string | null;
  NationalCode?: string | null;
  passportNumber?: string | null;
  PassportNumber?: string | null;
  dateOfBirth?: string | null;
  DateOfBirth?: string | null;
};

/** POST /Individual/{id}/CheckCapacity returns a bare boolean (`result.Result`). */
export type CheckCapacityResult =
  | boolean
  | {
      result?: boolean;
      Result?: boolean;
      maleCapacity?: number;
      MaleCapacity?: number;
      femaleCapacity?: number;
      FemaleCapacity?: number;
      overallCapacity?: number;
      OverallCapacity?: number;
      emptyCapacity?: number;
      EmptyCapacity?: number;
      maleAvailability?: boolean;
      MaleAvailability?: boolean;
      femaleAvailability?: boolean;
      FemaleAvailability?: boolean;
    };

export type FaqDto = {
  id?: string;
  Id?: string;
  question?: string | null;
  Question?: string | null;
  answer?: string | null;
  Answer?: string | null;
};

// --- Command / query payloads (aligned with backendSchemas.txt) ---

/** AdminLogInCommand */
export type AdminLogInCommand = {
  username?: string | null;
  password?: string | null;
};

/** CaravanPrincipalLogInCommand */
export type CaravanLogInCommand = {
  username?: string | null;
  password?: string | null;
};

/** IndividualPrincipalLogInCommand */
export type IndividualLogInCommand = {
  username?: string | null;
  password?: string | null;
};

/** IndividualPrincipalSignInCommand */
export type IndividualSignInCommand = {
  name?: string | null;
  familyName?: string | null;
  nationalCode?: string | null;
  dateOfBirth?: string;
  gender?: Gender;
  passportNumber?: string | null;
  gmail?: string | null;
  phoneNumber?: string | null;
  emergencyPhoneNumber?: string | null;
  username?: string | null;
  password?: string | null;
  bloodType?: BloodType;
};

/** CaravanPrincipalSignInCommand */
export type CaravanSignInCommand = IndividualSignInCommand;

/** CheckCapacityForAmountQuery */
export type CheckCapacityCommand = {
  individualId: string;
  enterTime: string;
  exitTime: string;
  maleAmount: number;
  femaleAmount: number;
};

/** ReserveRoomCommand */
export type ReserveRoomCommand = {
  individualId: string;
  dateOfEntrance: string;
  dateOfExit: string;
  maleAmount: number;
  femaleAmount: number;
  travelers?: TravelerDto[] | null;
};

/** CaravanSendsRequestCommand — members are counts only (no names). */
export type CaravanSendsRequestCommand = {
  caravanId: string;
  maleAmount: number;
  femaleAmount: number;
  enterTime: string;
  exitTime: string;
};

/** AddCompanionCommand */
export type AddCompanionCommand = {
  individualId: string;
  name?: string | null;
  familyName?: string | null;
  nationalCode?: string | null;
  passportNumber?: string | null;
  dateOfBirth?: string;
  phoneNumber?: string | null;
  emergencyPhoneNumber?: string | null;
  gender?: Gender;
};

/** RemoveCompanionCommand */
export type RemoveCompanionCommand = {
  individualId: string;
  companionId: string;
};

/** ChangingIndividualPrincipalInformationCommand */
export type ChangeIndividualProfileCommand = {
  individualId: string;
  name?: string | null;
  familyName?: string | null;
  nationalCode?: string | null;
  dateOfBirth?: string;
  gender?: Gender;
  passportNumber?: string | null;
  gmail?: string | null;
  phoneNumber?: string | null;
  emergencyPhoneNumber?: string | null;
  bloodType?: BloodType;
};

/** ChangingCaravansPrincipalCommand */
export type ChangeCaravanProfileCommand = {
  caravanId: string;
  name?: string | null;
  familyName?: string | null;
  nationalCode?: string | null;
  dateOfBirth?: string;
  gender?: Gender;
  passportNumber?: string | null;
  gmail?: string | null;
  phoneNumber?: string | null;
  emergencyPhoneNumber?: string | null;
  bloodType?: BloodType;
};

/** Caravan GET principal payload (same fields as individual + principalId). */
export type CaravanPrincipalDto = IndividualPrincipalDto & {
  principalId?: string;
  PrincipalId?: string;
};

/** AddPilgrimCommand */
export type AddPilgrimCommand = {
  caravanId: string;
  name?: string | null;
  familyName?: string | null;
  nationalCode?: string | null;
  passportNumber?: string | null;
  dateOfBirth?: string;
  phoneNumber?: string | null;
  emergencyPhoneNumber?: string | null;
  gender?: Gender;
};

/** RemovePilgrimCommand */
export type RemovePilgrimCommand = {
  caravanId: string;
  nationalCode?: string | null;
};

/** PrincipalsLogOutCommand */
export type PrincipalsLogOutCommand = {
  id: string;
};

/** PrincipalsChangePasswordCommand */
export type PrincipalsChangePasswordCommand = {
  id: string;
  currentPassword?: string | null;
  newPassword?: string | null;
};

export type OfficialDto = {
  id?: string;
  Id?: string;
  name?: string | null;
  Name?: string | null;
  lastName?: string | null;
  LastName?: string | null;
  familyName?: string | null;
  FamilyName?: string | null;
  nationalCode?: string | null;
  NationalCode?: string | null;
  phoneNumber?: string | null;
  PhoneNumber?: string | null;
  isActive?: boolean;
  IsActive?: boolean;
  createdAt?: string | null;
  CreatedAt?: string | null;
};

/** AddOfficialsCommand — api.json fields only */
export type AddOfficialCommand = {
  name?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
};

/** EditOfficialsCommand */
export type EditOfficialCommand = {
  id: string;
  name?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
};

export type RoomDto = {
  id?: string;
  Id?: string;
  name?: string | null;
  Name?: string | null;
  gender?: Gender;
  Gender?: Gender;
  capacity?: number;
  Capacity?: number;
};

/** Mokeb.Application.Dtos.RoomAvailabilityDto */
export type RoomAvailabilityDto = {
  id?: string;
  Id?: string;
  roomAvailabilityId?: string;
  RoomAvailabilityId?: string;
  roomId?: string;
  RoomId?: string;
  roomName?: string | null;
  RoomName?: string | null;
  capacity?: number;
  Capacity?: number;
  overallCapacity?: number;
  OverallCapacity?: number;
  reserved?: number;
  Reserved?: number;
  reservedAmount?: number;
  ReservedAmount?: number;
  available?: number;
  Available?: number;
  emptyCapacity?: number;
  EmptyCapacity?: number;
  date?: string | null;
  Date?: string | null;
  enterDate?: string | null;
  EnterDate?: string | null;
  exitDate?: string | null;
  ExitDate?: string | null;
  gender?: Gender;
  Gender?: Gender;
  reserveStatus?: string | null;
  ReserveStatus?: string | null;
};

export type RoomGenderAmountsDto = {
  subject?: string | null;
  Subject?: string | null;
  maleCount?: number;
  MaleCount?: number;
  maleOverall?: number;
  MaleOverall?: number;
  femaleCount?: number;
  FemaleCount?: number;
  femaleOverall?: number;
  FemaleOverall?: number;
  overallPercentage?: number;
  OverallPercentage?: number;
};

export type RoomReportStatsDto = {
  amountOfFilledCapacity?: number;
  AmountOfFilledCapacity?: number;
  presentAmounts?: RoomGenderAmountsDto | null;
  PresentAmounts?: RoomGenderAmountsDto | null;
  entryAmounts?: RoomGenderAmountsDto | null;
  EntryAmounts?: RoomGenderAmountsDto | null;
  outboundAmounts?: RoomGenderAmountsDto | null;
  OutBoundAmounts?: RoomGenderAmountsDto | null;
  outBoundAmounts?: RoomGenderAmountsDto | null;
  /** Legacy flat fields (if backend adds them later). */
  totalCapacity?: number;
  TotalCapacity?: number;
  maleCapacity?: number;
  MaleCapacity?: number;
  femaleCapacity?: number;
  FemaleCapacity?: number;
  reservedCapacity?: number;
  ReservedCapacity?: number;
  availableCapacity?: number;
  AvailableCapacity?: number;
};

export type AddRoomCommand = {
  name?: string | null;
  gender?: Gender;
  capacity?: number;
};

/** AddingRoomAvailabilityCommand */
export type AddRoomAvailabilityCommand = {
  roomId: string;
  dateOfAvailability: string;
};

/** UpdatingRoomAvailabilityDateCommand */
export type ChangeRoomAvailabilityDateCommand = {
  availabilityId: string;
  newDate: string;
};

/** RemovingRoomCommand */
export type RemoveRoomCommand = {
  roomId: string;
};

/** AcceptingARequestedRequestCommand */
export type AcceptRequestCommand = {
  requestId: string;
  roomAvailabilityIds: string[];
};

/** RejectingARequestedRequestCommand */
export type RejectRequestCommand = {
  requestId: string;
};

/**
 * Union of RequestedRequestsDto + Incoming/Outgoing response DTOs.
 * Field names differ per endpoint — mappers read all aliases.
 */
export type RequestStatusDto = {
  id?: string;
  Id?: string;
  requestId?: string;
  RequestId?: string;
  name?: string | null;
  Name?: string | null;
  familyName?: string | null;
  FamilyName?: string | null;
  fullName?: string | null;
  FullName?: string | null;
  supervisorName?: string | null;
  SupervisorName?: string | null;
  phoneNumber?: string | null;
  PhoneNumber?: string | null;
  totalCapacity?: number;
  TotalCapacity?: number;
  overallCount?: number;
  OverallCount?: number;
  maleAmount?: number;
  MaleAmount?: number;
  maleCount?: number;
  MaleCount?: number;
  femaleAmount?: number;
  FemaleAmount?: number;
  femaleCount?: number;
  FemaleCount?: number;
  entranceDate?: string | null;
  EntranceDate?: string | null;
  enterDate?: string | null;
  EnterDate?: string | null;
  exitDate?: string | null;
  ExitDate?: string | null;
  enterTime?: string | null;
  EnterTime?: string | null;
  exitTime?: string | null;
  ExitTime?: string | null;
  state?: number;
  State?: number;
  requestState?: number;
  RequestState?: number;
  stringState?: string | null;
  StringState?: string | null;
  principalType?: string | null;
  PrincipalType?: string | null;
  reservationType?: string | null;
  ReservationType?: string | null;
  reservationClass?: string | null;
  ReservationClass?: string | null;
  reservationCode?: string | null;
  ReservationCode?: string | null;
  representativeFirstName?: string | null;
  RepresentativeFirstName?: string | null;
  representativeLastName?: string | null;
  RepresentativeLastName?: string | null;
  mobile?: string | null;
  Mobile?: string | null;
  stayDuration?: number;
  StayDuration?: number;
  travelers?: TravelerDto[] | null;
  Travelers?: TravelerDto[] | null;
};

export type ChangeRequestDateCommand = {
  requestId?: string | null;
  date?: string;
};

export type RequestTypeStatsCommand = {
  year?: string | null;
};

export type GenderStatsInYearCommand = {
  year?: string | null;
};

/** AddingRoomAvailabilityToAnAcceptedRequestCommand */
export type RoomAvailabilityToAcceptedRequestCommand = {
  requestId: string;
  roomAvailabilityId: string;
  amount: number;
};

export type ActivateOrDeactivatePrincipalCommand = {
  principalId: string;
  activeOrDeactive: boolean;
};

export type SearchPrincipalsQuery = { input?: string | null };

export type DeleteCaravanCommand = { caravanId: string };

export type DeleteIndividualCommand = { individualId: string };
