# sveltekit-long-poll

This is a simple adjustment to the usual sveltekit demo template app, which adds a simple
long polling log system, and demonstrates it by providing chat rooms.

In a real world application you would want to clear the logs out of memory when they're not in use for a while. And for a chat, you'd also probably want to start sparsely clearing out
the start of the array. It wouldn't make sense to keep the entire history in memory forever.

But for relatively short lived sessions, like streaming updates of a long running server
operation to the client, or a mulitplayer game where there's a pretty finite limit on how
long a game will run or how many actions will occur, it's pretty reasonable to just keep
the whole state stored in memory while people are still using it.

Made this to demonstrate to a friend, how long polling can be used to provide usable and
responsive push in a sveltekit application without needing to wait for sveltekit to ship
streaming responses, and without needing to get messy with websockets.

` -<3 Phoenix`
