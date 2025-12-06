export const mockCustomers = [
  {
    id: 'CUST-001',
    name: 'Nordic Retail Group',
    address: 'Drottninggatan 45, Stockholm',
    status: 'ALARM_ACTIVE',
    camera: 'CAM-04 (Main Entrance)',
    videoFile: '/recordings/retail_robbery.mp4', // Placeholder
    timestamp: 'Now'
  },
  {
    id: 'CUST-002',
    name: 'TechHub Sthlm',
    address: 'Birger Jarlsgatan 12, Stockholm',
    status: 'ALARM_ACTIVE',
    camera: 'CAM-02 (Server Room)',
    videoFile: '/recordings/server_room.mp4', // Placeholder
    timestamp: '2 min ago'
  },
  {
    id: 'CUST-003',
    name: 'Private Residence',
    address: 'Strandvägen 7, Stockholm',
    status: 'SAFE',
    camera: 'CAM-01 (Garden)',
    videoFile: null,
    timestamp: 'Live'
  }
];
