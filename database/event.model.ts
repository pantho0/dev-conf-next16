import mongoose, { HydratedDocument, Model, Schema } from 'mongoose';

// TypeScript interface for Event document (plain shape)
export interface IEvent {
  title: string;
  // Generated in a pre-save hook; not required at creation time
  slug?: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  // Added automatically by Mongoose timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

// Hydrated document type for runtime documents
export type EventDocument = HydratedDocument<IEvent>;

// Event schema definition
const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: ['online', 'offline', 'hybrid'],
      lowercase: true,
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Tags must contain at least one item',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster slug-based queries
EventSchema.index({ slug: 1 });

/**
 * Pre-save hook to:
 * 1. Generate URL-friendly slug from title (only if title changed)
 * 2. Normalize date to ISO format
 * 3. Normalize time to consistent format (HH:MM)
 */
EventSchema.pre('save', async function (next) {
  const event = this as EventDocument;

  // Generate slug only if title is new or modified
  if (event.isModified('title')) {
    event.slug = event.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    // Ensure slug uniqueness by appending timestamp if needed
    // Use the current model to ensure correct typing and avoid recompilation issues
    const EventModel = this.constructor as Model<IEvent>;
    const existingEvent = await EventModel.findOne({ slug: event.slug });
    if (existingEvent && existingEvent._id.toString() !== event._id.toString()) {
      event.slug = `${event.slug}-${Date.now()}`;
    }
  }

  // Normalize date to ISO format (YYYY-MM-DD)
  if (event.isModified('date')) {
    try {
      const parsedDate = new Date(event.date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format');
      }
      event.date = parsedDate.toISOString().split('T')[0];
    } catch (error) {
      // @ts-ignore
        return next(new Error('Date must be a valid date string'));
    }
  }

  // Normalize time to HH:MM format
  if (event.isModified('time')) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(event.time)) {
      // Try parsing common time formats
      try {
        const timeParts = event.time.match(/(\d{1,2}):(\d{2})/);
        if (timeParts) {
          const hours = parseInt(timeParts[1], 10);
          const minutes = parseInt(timeParts[2], 10);
          if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
            event.time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          } else {
            throw new Error('Invalid time');
          }
        } else {
          throw new Error('Invalid time format');
        }
      } catch (error) {
        // @ts-ignore
          return next(new Error('Time must be in HH:MM format (24-hour)'));
      }
    }
  }

  // @ts-ignore
    next();
});

// Prevent model recompilation in development
const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
