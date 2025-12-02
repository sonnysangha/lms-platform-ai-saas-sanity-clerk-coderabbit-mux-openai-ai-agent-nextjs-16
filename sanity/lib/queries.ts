import { defineQuery } from "next-sanity";

export const FEATURED_COURSES_QUERY = defineQuery(`*[
  _type == "course"
  && featured == true
] | order(_createdAt desc)[0...6] {
  _id,
  title,
  slug,
  description,
  tier,
  featured,
  thumbnail {
    asset-> {
      _id,
      url
    }
  },
  "moduleCount": count(modules),
  "lessonCount": count(modules[]->lessons[])
}`);

export const ALL_COURSES_QUERY = defineQuery(`*[
  _type == "course"
] | order(_createdAt desc) {
  _id,
  title,
  slug,
  description,
  tier,
  featured,
  thumbnail {
    asset-> {
      _id,
      url
    }
  },
  "moduleCount": count(modules),
  "lessonCount": count(modules[]->lessons[])
}`);

export const COURSE_BY_ID_QUERY = defineQuery(`*[
  _type == "course"
  && _id == $id
][0] {
  _id,
  title,
  slug,
  description,
  tier,
  featured,
  thumbnail {
    asset-> {
      _id,
      url
    }
  },
  category-> {
    _id,
    title
  },
  modules[]-> {
    _id,
    title,
    description,
    lessons[]-> {
      _id,
      title,
      slug
    }
  }
}`);

export const COURSE_BY_SLUG_QUERY = defineQuery(`*[
  _type == "course"
  && slug.current == $slug
][0] {
  _id,
  title,
  slug,
  description,
  tier,
  featured,
  thumbnail {
    asset-> {
      _id,
      url
    }
  },
  category-> {
    _id,
    title
  },
  modules[]-> {
    _id,
    title,
    description,
    lessons[]-> {
      _id,
      title,
      slug
    }
  }
}`);

export const STATS_QUERY = defineQuery(`{
  "courseCount": count(*[_type == "course"]),
  "lessonCount": count(*[_type == "lesson"])
}`);

export const DASHBOARD_COURSES_QUERY = defineQuery(`*[
  _type == "course"
] | order(_createdAt desc) {
  _id,
  title,
  slug,
  description,
  tier,
  featured,
  completedBy,
  thumbnail {
    asset-> {
      _id,
      url
    }
  },
  category-> {
    _id,
    title
  },
  modules[]-> {
    lessons[]-> {
      completedBy
    }
  },
  "moduleCount": count(modules),
  "lessonCount": count(modules[]->lessons[])
}`);

export const COURSE_WITH_MODULES_QUERY = defineQuery(`*[
  _type == "course"
  && slug.current == $slug
][0] {
  _id,
  title,
  slug,
  description,
  tier,
  featured,
  thumbnail {
    asset-> {
      _id,
      url
    }
  },
  category-> {
    _id,
    title
  },
  modules[]-> {
    _id,
    title,
    description,
    completedBy,
    lessons[]-> {
      _id,
      title,
      slug,
      description,
      completedBy,
      video {
        asset-> {
          playbackId
        }
      }
    }
  },
  completedBy,
  "moduleCount": count(modules),
  "lessonCount": count(modules[]->lessons[]),
  "completedLessonCount": count(modules[]->lessons[]->completedBy[@==$userId])
}`);

export const LESSON_BY_ID_QUERY = defineQuery(`*[
  _type == "lesson"
  && _id == $id
][0] {
  _id,
  title,
  slug,
  description,
  video {
    asset-> {
      playbackId,
      status,
      data {
        duration
      }
    }
  },
  content,
  completedBy,
  "courses": *[_type == "course" && ^._id in modules[]->lessons[]->_id] | order(
    select(tier == "free" => 0, tier == "pro" => 1, tier == "ultra" => 2)
  ) {
    _id,
    title,
    slug,
    tier,
    modules[]-> {
      _id,
      title,
      lessons[]-> {
        _id,
        title,
        slug,
        completedBy
      }
    }
  }
}`);

export const LESSON_BY_SLUG_QUERY = defineQuery(`*[
  _type == "lesson"
  && slug.current == $slug
][0] {
  _id,
  title,
  slug,
  description,
  video {
    asset-> {
      playbackId,
      status,
      data {
        duration
      }
    }
  },
  content,
  completedBy,
  "courses": *[_type == "course" && ^._id in modules[]->lessons[]->_id] | order(
    select(tier == "free" => 0, tier == "pro" => 1, tier == "ultra" => 2)
  ) {
    _id,
    title,
    slug,
    tier,
    modules[]-> {
      _id,
      title,
      lessons[]-> {
        _id,
        title,
        slug,
        completedBy
      }
    }
  }
}`);

export const LESSON_NAVIGATION_QUERY = defineQuery(`*[
  _type == "course"
  && $lessonId in modules[]->lessons[]->_id
][0] {
  _id,
  title,
  tier,
  modules[]-> {
    _id,
    title,
    lessons[]-> {
      _id,
      title
    }
  }
}`);
