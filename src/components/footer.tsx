"use client"

import Link from "next/link"

export default function Footer() {
  return (
        <footer className="bg-[#0075CA] text-white py-8 w-full rounded-t-3xl mt-auto ellp-gradient">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center">
                 <div className="flex space-x-6 mb-4 md:mb-0">
                  <Link href="/" className="hover:text-[#f58e2f] transition-colors">
                    Sobre
                  </Link>
                   <Link href="/contato" className="hover:text-[#f58e2f] transition-colors">
                    Contato
                  </Link>
                  <Link href="/redes" className="hover:text-[#f58e2f] transition-colors">
                    ELLP nas redes
                  </Link>
                    <div className="text-white/60 text-sm">
                      <p>© {new Date().getFullYear()} ELLP-project</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
  )}