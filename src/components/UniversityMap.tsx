'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
const customIcon = typeof window !== 'undefined' ? L.divIcon({
  className: 'custom-marker',
  html: `
    <div style="position: relative;">
      <svg width="28" height="38" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12zm0 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="#DC2626"/>
      </svg>
    </div>
  `,
  iconSize: [28, 38],
  iconAnchor: [14, 38],
  popupAnchor: [0, -38]
}) : undefined;

interface University {
  name: string;
  nameAr: string;
  lat: number;
  lng: number;
}

const egyptianUniversities: University[] = [
  { name: 'Cairo University', nameAr: 'جامعة القاهرة', lat: 30.0260, lng: 31.2081 },
  { name: 'Alexandria University', nameAr: 'جامعة الإسكندرية', lat: 31.2001, lng: 29.9187 },
  { name: 'Ain Shams University', nameAr: 'جامعة عين شمس', lat: 30.0715, lng: 31.2816 },
  { name: 'Assiut University', nameAr: 'جامعة أسيوط', lat: 27.1809, lng: 31.1837 },
  { name: 'Tanta University', nameAr: 'جامعة طنطا', lat: 30.7865, lng: 31.0004 },
  { name: 'Mansoura University', nameAr: 'جامعة المنصورة', lat: 31.0364, lng: 31.3807 },
  { name: 'Zagazig University', nameAr: 'جامعة الزقازيق', lat: 30.5852, lng: 31.5039 },
  { name: 'Helwan University', nameAr: 'جامعة حلوان', lat: 29.8500, lng: 31.3000 },
  { name: 'Minia University', nameAr: 'جامعة المنيا', lat: 28.0871, lng: 30.7618 },
  { name: 'Menoufia University', nameAr: 'جامعة المنوفية', lat: 30.5965, lng: 31.0117 },
  { name: 'Suez Canal University', nameAr: 'جامعة قناة السويس', lat: 30.5852, lng: 32.2654 },
  { name: 'South Valley University', nameAr: 'جامعة جنوب الوادي', lat: 25.6872, lng: 32.6396 },
  { name: 'Benha University', nameAr: 'جامعة بنها', lat: 30.4596, lng: 31.1787 },
  { name: 'Fayoum University', nameAr: 'جامعة الفيوم', lat: 29.3084, lng: 30.8428 },
  { name: 'Beni-Suef University', nameAr: 'جامعة بني سويف', lat: 29.0661, lng: 31.0994 },
  { name: 'Kafr El Sheikh University', nameAr: 'جامعة كفر الشيخ', lat: 31.1107, lng: 30.9388 },
  { name: 'Sohag University', nameAr: 'جامعة سوهاج', lat: 26.5569, lng: 31.6948 },
  { name: 'Port Said University', nameAr: 'جامعة بورسعيد', lat: 31.2653, lng: 32.3019 },
  { name: 'Damanhour University', nameAr: 'جامعة دمنهور', lat: 31.0341, lng: 30.4707 },
  { name: 'Damietta University', nameAr: 'جامعة دمياط', lat: 31.4165, lng: 31.8133 },
  { name: 'Aswan University', nameAr: 'جامعة أسوان', lat: 24.0889, lng: 32.8998 },
  { name: 'Luxor University', nameAr: 'جامعة الأقصر', lat: 25.6872, lng: 32.6396 },
  { name: 'New Valley University', nameAr: 'جامعة الوادي الجديد', lat: 25.4516, lng: 28.9826 },
  { name: 'Matrouh University', nameAr: 'جامعة مطروح', lat: 31.3543, lng: 27.2373 },
  { name: 'American University in Cairo', nameAr: 'الجامعة الأمريكية بالقاهرة', lat: 30.0131, lng: 31.4989 },
  { name: 'German University in Cairo', nameAr: 'الجامعة الألمانية بالقاهرة', lat: 29.9584, lng: 31.4509 },
  { name: 'British University in Egypt', nameAr: 'الجامعة البريطانية في مصر', lat: 29.9829, lng: 31.4486 },
  { name: 'Nile University', nameAr: 'جامعة النيل', lat: 30.0725, lng: 31.0214 },
  { name: 'Misr University for Science and Technology', nameAr: 'جامعة مصر للعلوم والتكنولوجيا', lat: 29.9869, lng: 31.2708 },
  { name: '6th October University', nameAr: 'جامعة 6 أكتوبر', lat: 29.9584, lng: 31.0214 },
];

interface UniversityMapProps {
  locale: 'ar' | 'en';
}

export default function UniversityMap({ locale }: UniversityMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This ensures Leaflet is only initialized on the client side
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/marker-icon-2x.png',
        iconUrl: '/marker-icon.png',
        shadowUrl: '/marker-shadow.png',
      });
    }
    // This is intentional for client-side only mounting of Leaflet
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-full w-full min-h-150 bg-gray-100 dark:bg-gray-700 animate-pulse rounded-lg flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400">جاري تحميل الخريطة...</span>
      </div>
    );
  }

  return (
    <div className="h-full w-full min-h-150 rounded-lg overflow-hidden">
      <MapContainer
        center={[26.8206, 30.8025]} // مركز مصر
        zoom={6}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
        scrollWheelZoom={false}
        zoomControl={true}
        className="leaflet-container-mobile"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {egyptianUniversities.map((university, index) => (
          <Marker 
            key={index} 
            position={[university.lat, university.lng]}
            icon={customIcon!}
          >
            <Popup
              maxWidth={200}
              minWidth={150}
              className="custom-popup"
            >
              <div className="text-center p-1 sm:p-2">
                <strong className="text-xs sm:text-sm font-bold text-gray-900 block">
                  {locale === 'ar' ? university.nameAr : university.name}
                </strong>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
