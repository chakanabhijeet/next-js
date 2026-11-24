/*
 * ====================================================================
 *  MACHINES CONFIG  -  the ONLY file you edit to add / change devices
 * ====================================================================
 *
 *  Path: src/features/monitoring/config/machines.config.js
 *
 *  HOW TO ADD A NEW MACHINE
 *  ------------------------
 *  1. New device?  Add it in DEVICES below (device id + tenant id).
 *  2. Add one entry in MACHINES below (key, title, device, ...).
 *  3. Put it in an existing `group`, or add a new group in GROUPS.
 *
 *  The service, the view model and the dashboard page all read from
 *  this file, so nothing else needs to change.
 */

/* ------------------------------------------------------------------
   1. DEVICES
   The physical devices. `id` is sent to the API as device_id.
   `tenantId` is sent on the LIVE (today) API only.
------------------------------------------------------------------ */
export const DEVICES = {
  AERO_DEFLECTOR: { id: "02@xoom", tenantId: "02" },
  DOOR_CLADDING: { id: "01@xoom", tenantId: "TENANT-001" },
  WHEEL_ARCH: { id: "03@xoom", tenantId: "02" },
};

/* ------------------------------------------------------------------
   2. GROUPS
   How machines are arranged on the dashboard.
   `label` and `badgeClass` are only used by the HIGH / LOW sections.
------------------------------------------------------------------ */
export const GROUPS = {
  AERO: { id: "aero" },
  DOOR_CLADDING: { id: "doorCladding" },
  WHEEL_ARCH_HIGH: {
    id: "wheelArchHigh",
    label: "PACK C · HIGH VARIANT",
    badgeClass: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300",
  },
  WHEEL_ARCH_LOW: {
    id: "wheelArchLow",
    label: "PACK AB · LOW VARIANT",
    badgeClass: "bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300",
  },
};

/* ------------------------------------------------------------------
   3. MACHINES
   One entry per card on the dashboard.

     key      unique name used in code (do not repeat)
     title    name shown on the card
     device   one of DEVICES above
     group    one of GROUPS above (id)
     station  "RH" / "LH"  (leave out if the machine has none)
     variant  "HIGH" / "LOW" (leave out if the machine has none)
     badge    small tag on the card header (optional)
     showVariant  true = show the "Variant:" row on the card (optional)

   The ORDER of this list is the order cards appear in their group.
------------------------------------------------------------------ */
export const MACHINES = [
  {
    key: "aeroDeflector",
    title: "Aero Deflector",
    device: DEVICES.AERO_DEFLECTOR,
    group: GROUPS.AERO.id,
  },

  {
    key: "rh",
    title: "W610 Rear Door Cladding RH",
    device: DEVICES.DOOR_CLADDING,
    group: GROUPS.DOOR_CLADDING.id,
    station: "RH",
  },
  {
    key: "lh",
    title: "W610 Rear Door Cladding LH",
    device: DEVICES.DOOR_CLADDING,
    group: GROUPS.DOOR_CLADDING.id,
    station: "LH",
  },

  {
    key: "rhHigh",
    title: "W610 Rear Wheel Arch Cladding RH",
    badge: "PACK C",
    device: DEVICES.WHEEL_ARCH,
    group: GROUPS.WHEEL_ARCH_HIGH.id,
    station: "RH",
    variant: "HIGH",
    showVariant: true,
  },
  {
    key: "lhHigh",
    title: "W610 Rear Wheel Arch Cladding LH",
    badge: "PACK C",
    device: DEVICES.WHEEL_ARCH,
    group: GROUPS.WHEEL_ARCH_HIGH.id,
    station: "LH",
    variant: "HIGH",
    showVariant: true,
  },
  {
    key: "rhLow",
    title: "W610 Rear Wheel Arch Cladding RH",
    badge: "PACK AB",
    device: DEVICES.WHEEL_ARCH,
    group: GROUPS.WHEEL_ARCH_LOW.id,
    station: "RH",
    variant: "LOW",
    showVariant: true,
  },
  {
    key: "lhLow",
    title: "W610 Rear Wheel Arch Cladding LH",
    badge: "PACK AB",
    device: DEVICES.WHEEL_ARCH,
    group: GROUPS.WHEEL_ARCH_LOW.id,
    station: "LH",
    variant: "LOW",
    showVariant: true,
  },
];

/* ------------------------------------------------------------------
   Helpers (no need to edit below this line)
------------------------------------------------------------------ */

// All machine keys, e.g. ["aeroDeflector", "rh", ...]
export const MACHINE_KEYS = MACHINES.map((machine) => machine.key);

export function getMachineConfig(key) {
  return MACHINES.find((machine) => machine.key === key) ?? null;
}

// Machines of one group, in config order.
export function getMachinesByGroup(groupId) {
  return MACHINES.filter((machine) => machine.group === groupId);
}

// Machines that belong to one device.
export function getMachinesByDevice(device) {
  return MACHINES.filter((machine) => machine.device.id === device.id);
}

// The part of the API payload that identifies a machine.
// station / variant are only included when the machine has them.
export function buildMachinePayload(machine) {
  const payload = { device_id: machine.device.id };

  if (machine.station) payload.station = machine.station;
  if (machine.variant) payload.variant = machine.variant;

  return payload;
}