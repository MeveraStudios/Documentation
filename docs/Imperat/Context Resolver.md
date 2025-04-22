---
sidebar_position: 6
---

Unlike the [Parameter Type](Parameter-Type.md), the context resolver resolves a value that is NOT DIRECTLY from the input,
however the value is created from the context by a certain logic you specify.

:::tip
If you don't know what is a context or any other keywords used in this section, 
please refer to [Introduction](Introduction.md) then [Dispatcher API](Dispatcher%20API.md) to become well-oriented with the framework's necessary basics.
:::

Therefore, instead of writing a lot of local variables to use inside of your command-execution repeatedly, you will be able to obtain them automatically without the need for boilerplate code. 

### Example Bukkit Scenario: 

If you're creating a guild command that will have a lot of subcommands such as:
`/guild disband`  
`/guild invite <player>`  
`/guild kick <player>`  

In each subcommand's execution, you will need to create a local variable for the `Guild` object
which belongs to the command-source/sender so that you can operate on the `Guild` object by
removing/adding members or even deleting the guild of the command-source.

Since the `Source` is a part of the Context of a command, therefore we call that argument/value **a Context-Aware/Context-Resolved** value, as we deduced/created this value from the data related to the context.

So instead of repeating ourselves in each subcommand's execution, we will just have to create a `ContextResolver` for the type `Guild` as in the example below:

```java
public final class GuildContextResolver implements ContextResolver<BukkitSource, Guild> {
    
    /**
     * Resolves a parameter's default value
     * if it has been not input by the user
     *
     * @param context   the context
     * @param parameter the parameter (null if used the classic way)
     * @return the resolved default-value
     */
    @Override
    public @NotNull Guild resolve(
            @NotNull Context<BukkitSource> context,
            @Nullable ParameterElement parameter
    ) throws ImperatException {
        var source = context.source();
        if (source.isConsole()) {
            throw new SourceException("Only a player can do this!");
        }
        Player player = source.as(Player.class);
        Guild guild = GuildRegistry.getInstance().getUserGuild(player.getUniqueId());
        if (guild == null) {
            throw new SourceException("You don't have a guild!");
        }
        return guild;
    }
}
```

#### Registering the context resolver

It's simple, all you have to do is call the method `Imperat#registerContextResolver`
for a specific type of object as shown in the example below: 

```java
imperat = BukkitImperat.builder(plugin)
    .contextResolver(Guild.class, new GuildContextResolver())
    .build();
```

#### Using the context resolver

To use the context resolver, the context-resolved parameters now **require one of the following**:
1. **The parameter is annotated with `@ContextResolved`** (this is used in the examples below).  
2. **The parameter type itself is annotated with `@ContextResolved`.**  
3. **One of the parameter's annotations is annotated with `@ContextResolved`.**

It differs depending on which way you're creating your commands **(classic or annotations)**:

##### Classic
You should be able to automatically get the context resolved value from the `Context` object provided to you during command execution as follows:

```java
guildCommand.subCommand(
	"disband", 
	CommandUsage.<BukkitSource>builder()  
		.parameters() // no parameters in usage '/guild disband'  
		.execute((source, context) -> {  
		  // getting our context resolved Guild object's instance  
		  Guild guild = context.getContextResolvedArgument(Guild.class);  
		  guild.disband();  
		  source.reply("You have disbanded your guild successfully!!");  
		})
);
```

##### Annotations
You should be able to do the same while having slightly more advantage than classic.  
You will now need to annotate the context-resolved parameters with `@ContextResolved` in your usage methods, as in the example below:

```java
@SubCommand("disband")  
public void disband(BukkitSource source, @ContextResolved @NotNull Guild guild /*Context resolved*/) {  
	guild.disband();  
	source.reply("You have disbanded your guild successfully!!");  
}
```
