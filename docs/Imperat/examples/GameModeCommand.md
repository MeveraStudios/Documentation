---
sidebar_position: 12
---
# GameMode Command

This is a simple example of how you could create a gamemode command in minecraft **(using bukkit)**, along with its shortcuts (e.g: `/gms`, `/gmc`).
Before creating our command class, let's create a preprocess to make sure our gamemode command can be run by players only !
```java
public final class OnlyPlayerProcessor implements CommandPreProcessor<BukkitSource> {
    @Override
    public void process(Imperat<BukkitSource> imperat, Context<BukkitSource> context, CommandUsage<BukkitSource> usage) throws ImperatException {
        if(context.source().isConsole()) {
            throw new SourceException("Only players are allowed to use this command !");
        }
    }
}
```

Now let's write our command class:
```java

@Command({"gamemode", "gm"})
@Permission("lobby.gamemode")
@PreProcessor(OnlyPlayerProcessor.class)
public class GameModeCommand {

    @Usage
    public void defUsage(
            PaveSource source,
            @NotNull @Named("gamemode") GameMode gameMode,
            @Optional @Nullable @Named("player") Player other
    ) {
        // /gamemode <gamemode> [player]
        Player target = other == null ? source.asPlayer() : other;
        target.setGameMode(gameMode);

        LobbyCore.sendPrefixed(target, "&bYour gamemode has been set to &f&l" + capitalize(gameMode.name()));
        if(other != null) {
            LobbyCore.sendPrefixed(source.asPlayer(), "&7You have set &2" + other.getName() + "&7's gamemode to &2" + capitalize(gameMode.name()));
        }
    }

    @Command("gmc")
    public void gmc(PaveSource source, @Optional @Named("player") Player target) {
        defUsage(source, GameMode.CREATIVE, target);
    }

    @Command("gms")
    public void gms(PaveSource source, @Optional @Named("player") Player target) {
        defUsage(source, GameMode.SURVIVAL, target);
    }

    @Command("gma")
    public void gma(PaveSource source, @Optional @Named("player") Player target) {
        defUsage(source, GameMode.ADVENTURE, target);
    }

    @Command("gmsp")
    public void gmsp(PaveSource source, @Optional @Named("player") Player target) {
        defUsage(source, GameMode.SPECTATOR, target);
    }

    private static String capitalize(String str) {
        return str.substring(0, 1).toUpperCase() + str.substring(1);
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