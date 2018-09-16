import React from 'react';
import PropTypes from 'prop-types';

const DSiteLogo = () => {
    return (
        <span className="logo">
            <svg width="150" height="40" viewBox="0 0 150 40" version="1.1">
                <title>DSite logo</title>
                <defs>
                  <path id="dsite-a" d="M16.6711792,0.203465457 C15.9704866,0.204908701 15.2706522,0.341485123 14.7389977,0.613194726 L1.9433363,7.15313927 C0.874535656,7.699369 0,9.04029425 0,10.1329056 L0,23.2125668 C0,24.3051023 0.874535656,25.6461794 1.9433363,26.1925611 L7.60919814,29.0883155 L14.7389977,32.7322777 C15.8077983,33.2786594 17.5568696,33.2786594 18.6255844,32.7322777 L31.4213316,26.1925611 C32.4904755,25.6461794 33.3646679,24.3051023 33.3646679,23.2125668 L33.3646679,10.1329056 C33.3646679,9.04029425 32.4904755,7.699369 31.4213316,7.15313927 L18.6255844,0.613194726 C18.0940157,0.341485123 17.3941813,0.204908701 16.6934887,0.203465457 L16.6711792,0.203465457 Z"/>
                  <linearGradient id="dsite-b" x1="0%" x2="128.105%" y1="-2.284%" y2="120.365%">
                    <stop offset="0%" stop-color="#2DBFFF"/>
                    <stop offset="57.265%" stop-color="#7875F5"/>
                    <stop offset="100%" stop-color="#B543E9"/>
                  </linearGradient>
                  <path id="dsite-d" d="M0,22.4577388 L14.1037384,47.0575913 C14.1037384,49.645488 13.8380921,53.8269568 16.528582,55.121175 L24.5266894,68.8352364 L32.6017202,72.0975357 C28.1676823,72.0973558 29.0125546,70.1395273 30.9194708,82.1380578 C32.8263869,94.1365883 65.9271522,74.5364772 62.7905533,72.4478268 C61.8346575,71.8112991 45.3459274,23.8118089 45.3434305,18.089224 C45.3377342,5.03418456 28.0337273,0.846508226 29.4252253,5.68434189e-14 L0,22.4577388 Z"/>
                  <linearGradient id="dsite-e" x1="50%" x2="50%" y1="0%" y2="100%">
                    <stop offset="0%" stop-color="#F6F3EE" stop-opacity="0"/>
                    <stop offset="100%" stop-color="#D6D6D6" stop-opacity=".58"/>
                  </linearGradient>
                  <text id="dsite-h" fill="#FFF" font-family="Magz" font-size="32">
                    <tspan x="2.204" y="-211">d</tspan>
                  </text>
                  <filter id="dsite-g" width="107.2%" height="116.8%" x="-1.8%" y="-4.2%" filterUnits="objectBoundingBox">
                    <feOffset dx="22" dy="22" in="SourceAlpha" result="shadowOffsetOuter1"/>
                    <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="11"/>
                    <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.0641700634 0"/>
                  </filter>
                </defs>
                <g fill="none" fill-rule="evenodd">
                  <g transform="translate(2 4)">
                    <mask id="dsite-c" fill="#fff">
                      <use xlink:href="#dsite-a"/>
                    </mask>
                    <path fill="url(#dsite-b)" d="M14.7389977,0.613194726 L1.9433363,7.15313927 C0.874535656,7.699369 0,9.04029425 0,10.1329056 L0,23.2125668 C0,24.3051023 0.874535656,25.6461794 1.9433363,26.1925611 L7.60919814,29.0883155 L14.7389977,32.7322777 C15.8077983,33.2786594 17.5568696,33.2786594 18.6255844,32.7322777 L31.4213316,26.1925611 C32.4904755,25.6461794 33.3646679,24.3051023 33.3646679,23.2125668 L33.3646679,10.1329056 C33.3646679,9.04029425 32.4904755,7.699369 31.4213316,7.15313927 L18.6255844,0.613194726 C18.0940157,0.341485123 17.3941813,0.204908701 16.6934887,0.203465457 C15.9704866,0.204908701 15.2706522,0.341485123 14.7389977,0.613194726 Z" mask="url(#dsite-c)"/>
                    <g mask="url(#dsite-c)">
                      <g transform="rotate(-90 27.5 33.5)">
                        <mask id="dsite-f" fill="#fff">
                          <use xlink:href="#dsite-d"/>
                        </mask>
                        <path fill="url(#dsite-e)" d="M29.6353356,11.8783314 L26.9090318,19.8307673 C26.9090318,21.4278103 29.830721,29.8380971 31.135923,30.6367851 L34.6916848,39.5218039 L47,41 C44.8489735,40.999889 31.32128,16.6268878 39.8583363,-4.14285953 L26,-4.88300137 C26,-6.2545285 32.7952164,4.9001176 33.7661542,4.14873126 L29.6353356,11.8783314 Z" mask="url(#dsite-f)"/>
                      </g>
                    </g>
                    <g fill="#FFF" mask="url(#dsite-c)">
                      <use filter="url(#dsite-g)" xlink:href="#dsite-h"/>
                      <use xlink:href="#dsite-h"/>
                    </g>
                  </g>
                  <text fill="url(#dsite-b)" font-family="Carbon-Regular, Carbon" font-size="32">
                    <tspan x="36" y="33">site</tspan>
                  </text>
                </g>
            </svg>
        </span>
    );
};

export default DSiteLogo;
