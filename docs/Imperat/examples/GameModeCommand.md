---
sidebar_position: 12
---
# GameMode Command

This is a simple example of how you could create a gamemode command in minecraft **(using bukkit)**, along with its shortcuts (e.g: `/gms`, `/gmc`).
Before creating our command class, let's create a preprocess to make sure our gamemode command can be run by players only, We can easily do that by declaring the source as `Player`.
Now let's write our command class:

```java
@Command({"gamemode", "gm"})
@Permission("server.gamemode")
@Description("Change player gamemode")
public class GameModeCommand {

    @Usage
    public void mainUsage(
            Player source,
            @Named("mode") GameMode gameMode,
            @Default("me") @Named("target") Player target
    ) {
        // Handle: /gamemode <mode> [target]
        target.setGameMode(gameMode);
        
        source.sendMessage("Gamemode updated to " + gameMode.name());
        if (target != source) {
            target.sendMessage("Your gamemode was updated by " + source.getName());
        }
    }
    
    // Independent root aliases.
    @Command("gmc")
    @Permission("server.gamemode.creative")
    public void creative(Player source, @Default("me") @Named("target") Player target) {
        mainUsage(source, GameMode.CREATIVE, target);
    }
    
    @Command("gms")
    @Permission("server.gamemode.survival")
    public void survival(Player source, @Default("me") @Named("target") Player target) {
        mainUsage(source, GameMode.SURVIVAL, target);
    }
}
```

The above command class should work flawlessly. However, the command will only accept gamemode exact names,
the players will not be able to enter the gamemode's id, (e.g: `/gm 1` will not work and `1` will not be identified as a correct gamemode).
To fix this, we should implement our own parameter type for `GameMode` as follows:
```java
public final class ParameterGameMode extends BaseParameterType<BukkitSource, GameMode> {

    public ParameterGameMode() {
        super(GameMode.class);
        this.suggestions.addAll(Arrays.stream(GameMode.values())
                .map(GameMode::name)
                .toList());
    }

    @Override
    public GameMode resolve(@NotNull ExecutionContext<BukkitSource> context, @NotNull CommandInputStream<BukkitSource> stream, String input) throws ImperatException {
        String englishInput = input.toLowerCase(Locale.ENGLISH);
        if (TypeUtility.isInteger(englishInput)) {
            int modeInput = Integer.parseInt(englishInput);
            for (var gamemode : GameMode.values()) {
                if (gamemode.getValue() == modeInput) {
                    return gamemode;
                }
            }
        } else {

            for (var gamemode : GameMode.values()) {
                if (gamemode.name().toLowerCase().startsWith(englishInput)) {
                    return gamemode;
                }
            }

        }
        throw new SourceException("Invalid GameMode `" + input + "`");
    }

}
```

Now let's register our parameter type onEnable:
```java
private BukkitImperat imperat;
@Override
public void onEnable() {

    imperat = BukkitImperat.builder(this)
                .parameterType(GameMode.class, new ParameterGameMode())
                .build();
}
```