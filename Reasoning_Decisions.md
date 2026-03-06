



## This page answers the why? and reasons behind every decision in creating this website

## Why Supabase (and why PostGreSQL)?

## Why React + Vite?

## Why 

## Why use CloudFlare as a Content Distribution Network (CDN) Provider?

- It has an extensive network of servers around the globe, including (and most importantly) a server in Manila
- It offers free Distributed Denial of Service (DDOS) Protection
- We can enable blocking of AI bot crawlers to not scrape our staff's articles 

# Why use a hosting service instead of dedicated server?

MAIN REASON:  
- The university can suppress publication of material on the internet if within school premises
- Unstable network connectivity (PLDT ANUNA??!!!!!!!!)
- Power anxiety (would need an uninterruptible power supply)

SECONDARY: 
- Implementation Complexity
- Time-specific security anxiousness
- Security anxiety, would need a dedicated tech-y on stand by

# Why use CloudFlare for image storage solutions?

- It's cheaper than most if not all
- Zero egress fee
- Free 10 GB of storage ($0.015 / GB-month)
- 1M Class A write requests (write, update, or list data per month) / + $4.50 / additional million requests for that month
  (We will never reach more than 1 million write requests since we won't post millions of photos)

- 10M Class B read requests (read/retrieve data per month) / + $0.36 / additional million requests for that month
  (We will never reach more than 10 million read requests since we won't get 10 millions of reads even on Facebook, it's still a reasonable price even if we surpass 10 Million)

== Why not Cloudflare Images?

- Mahal.

# Why not Google Drive?

- Google Drive can only support limited amount of downloads per user
- Unreliable due to Google's own throttling of downloads and access to the image

