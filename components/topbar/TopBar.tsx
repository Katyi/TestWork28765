'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import style from './topBar.module.scss';
import { navLinks } from '@/lib/constants';

const TopBar = () => {
  const pathname = usePathname();

  return (
    <div className={style['top-bar']}>
      <div className="d-flex align-items-center gap-3">
        <Image src="/logo.png" alt="logo" width={70} height={70} />
        <p className="h3">About Wheather</p>
      </div>

      <div className="d-flex gap-3">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className={`h6 ${pathname === link.url ? 'visually-hidden' : ''}`}
          >
            <button type="button" className={style['top-bar-btn']}>
              {link.label}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopBar;
