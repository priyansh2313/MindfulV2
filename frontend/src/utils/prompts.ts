// src/components/prompts.ts

export const getGratitudePrompts = (mood: string): string[] => {
    const prompts: Record<string, string[]> = {
      happy: [
        "What part of your joy are you afraid might not last?",
        "What do you wish others could see about your happiness?",
        "Who makes you happy, even when you pretend they don’t matter?",
        "What makes your smile real — and what threatens it?",
        "When was the last time you felt this happy, and what happened next?",
      ],
      sad: [
        "What are you tired of pretending doesn't hurt?",
        "If your sadness could speak, what would it say?",
        "What emotion is sitting quietly underneath the sadness?",
        "Who do you miss — but can’t admit to missing?",
        "What do your tears keep trying to tell you?",
      ],
      angry: [
        "What did you want to scream but never did?",
        "Who crossed a line you still haven’t forgotten?",
        "What do you wish people understood about your silence?",
        "When did your anger turn into exhaustion?",
        "What apology are you still waiting for?",
      ],
      crying: [
        "What do your tears wish someone noticed?",
        "Who do you cry for — even if they’ll never know?",
        "What memory does your body still remember too well?",
        "What would it feel like if someone simply held space for you?",
        "What’s one thing you’ll never say out loud, but can write now?",
      ],
      anxious: [
        "What keeps looping in your head that you can’t say out loud?",
        "What fear have you made peace with — or tried to?",
        "What does safety mean to you when no one else is watching?",
        "What question are you afraid someone might ask you?",
        "What’s one thing you need to hear right now, even if you won’t believe it?",
      ],
      lonely: [
        "What do you wish someone would say to you right now?",
        "What version of yourself feels most alone — and why?",
        "Who do you pretend not to miss?",
        "When did you last feel truly seen — even for a moment?",
        "What do you wish someone would notice without you having to ask?",
      ],
      depressed: [
        "What does the part of you that gave up really want?",
        "What truth do you keep burying under 'I’m fine'?",
        "What would your younger self say if they saw you today?",
        "If your sadness had a name, what would it be?",
        "What’s the hardest thing to admit to yourself right now?",
      ],
      empty: [
        "What do you feel... when you feel nothing at all?",
        "What do you miss — even if you can’t define it?",
        "If numbness had a color, what would it be?",
        "What would it take to feel something again?",
        "What story are you afraid no one would understand?",
      ],
      guilty: [
        "What are you punishing yourself for, even silently?",
        "What do you wish you could undo, but can't?",
        "Who have you hurt — and how have you tried to make peace with it?",
        "What would it look like to forgive yourself?",
        "What’s the truth beneath your guilt?",
      ],
      tired: [
        "What are you carrying that no one sees?",
        "What would you do if you could pause life for 24 hours?",
        "What do you pretend isn’t exhausting — but it is?",
        "What are you always expected to be, even when you're drained?",
        "What have you been running from... in silence?",
      ],
      default: [
        "What are you holding back from sharing?",
        "What would you write if no one ever read it?",
        "What part of yourself are you still trying to protect?",
        "What’s something you feel but never say?",
        "Who do you want to forgive — or be forgiven by?",
      ],
    };
  
    return prompts[mood] || prompts.default;
  };