import type { Prayer } from "./types"

export const prayers: Prayer[] = [
  {
    id: "1",
    user: {
      id: "user1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    title: "Health Concerns",
    content:
      "Please pray for my upcoming surgery next week. I'm feeling anxious and could use prayers for peace and a successful procedure.",
    category: "Health",
    timeAgo: "2 hours ago",
    prayerCount: 24,
    messages: [
      {
        id: "msg1",
        user: {
          id: "user2",
          name: "Michael Brown",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "Praying for peace and healing. God is with you!",
        timestamp: "1 hour ago",
      },
    ],
  },
  {
    id: "2",
    user: {
      id: "user3",
      name: "David Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    title: "Family Struggles",
    content:
      "My son is going through a difficult time at school. Please pray for wisdom for us as parents and for him to find good friends.",
    category: "Family",
    timeAgo: "5 hours ago",
    prayerCount: 18,
  },
  {
    id: "3",
    user: {
      id: "user4",
      name: "Emily Martinez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    title: "Job Search",
    content:
      "I recently lost my job and am searching for a new position. Please pray for open doors and God's guidance in this process.",
    category: "Work",
    timeAgo: "1 day ago",
    prayerCount: 32,
    messages: [
      {
        id: "msg2",
        user: {
          id: "user5",
          name: "Jessica Taylor",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "Praying for you! I went through something similar last year and God provided in unexpected ways.",
        timestamp: "12 hours ago",
      },
    ],
  },
  {
    id: "4",
    user: {
      id: "user6",
      name: "Robert Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    title: "Spiritual Growth",
    content:
      "I've been feeling distant from God lately. Please pray that I would rediscover the joy of my faith and grow closer to Him.",
    category: "Spiritual",
    timeAgo: "3 days ago",
    prayerCount: 41,
  },
  {
    id: "5",
    user: {
      id: "user7",
      name: "Olivia Williams",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    title: "Financial Needs",
    content:
      "We're facing some unexpected medical bills this month. Please pray for provision and wisdom in managing our finances.",
    category: "Financial",
    timeAgo: "2 days ago",
    prayerCount: 29,
  },
  {
    id: "6",
    user: {
      id: "user8",
      name: "James Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    title: "Marriage Restoration",
    content:
      "My wife and I are going through a rough patch in our marriage. Please pray for healing, understanding, and renewed love between us.",
    category: "Relationships",
    timeAgo: "4 days ago",
    prayerCount: 37,
  },
]

