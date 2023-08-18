const iconWidth = "20px";
const iconHeight = "20px";

export const playIcon = (color: string) =>
  `<svg width="${iconWidth}" height="${iconHeight}" fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.376 12.4158L8.77735 19.4816C8.54759 19.6348 8.23715 19.5727 8.08397 19.3429C8.02922 19.2608 8 19.1643 8 19.0656V4.93408C8 4.65794 8.22386 4.43408 8.5 4.43408C8.59871 4.43408 8.69522 4.4633 8.77735 4.51806L19.376 11.5838C19.6057 11.737 19.6678 12.0474 19.5146 12.2772C19.478 12.3321 19.4309 12.3792 19.376 12.4158Z"></path></svg>`;

export const pauseIcon = (color: string) =>
  `<svg width="${iconWidth}" height="${iconHeight}" fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 5H8V19H6V5ZM16 5H18V19H16V5Z"></path></svg>`;

export const backwardIcon = (color: string) =>
  `<svg width="${iconWidth}" height="${iconHeight}" fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 12L14 6V18L8 12Z"></path></svg>`;

export const repeatIcon = (color: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${iconWidth}" height="${iconHeight}" fill="${color}" fill="white"><path d="M12 4C9.25144 4 6.82508 5.38626 5.38443 7.5H8V9.5H2V3.5H4V5.99936C5.82381 3.57166 8.72764 2 12 2C17.5228 2 22 6.47715 22 12H20C20 7.58172 16.4183 4 12 4ZM4 12C4 16.4183 7.58172 20 12 20C14.7486 20 17.1749 18.6137 18.6156 16.5H16V14.5H22V20.5H20V18.0006C18.1762 20.4283 15.2724 22 12 22C6.47715 22 2 17.5228 2 12H4Z"></path></svg>`;

export const grabIcon = (color: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24" width="${iconWidth}" height="${iconHeight}" fill="${color}">
       <path
         d="M16 13L22.9641 17.0622L19.9913 17.9129L22.116 21.5933L20.384 22.5933L18.2592 18.9129L16.0359 21.0622L16 13ZM14 6H16V8H21C21.5523 8 22 8.44772 22 9V13H20V10H10V20H14V22H9C8.44772 22 8 21.5523 8 21V16H6V14H8V9C8 8.44772 8.44772 8 9 8H14V6ZM4 14V16H2V14H4ZM4 10V12H2V10H4ZM4 6V8H2V6H4ZM4 2V4H2V2H4ZM8 2V4H6V2H8ZM12 2V4H10V2H12ZM16 2V4H14V2H16Z"></path>
  </svg>`;
